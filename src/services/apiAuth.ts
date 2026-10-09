import { getFcmToken } from "../firebase";
import {
  LoginType,
  RegisterUserType,
  RequestPasswordResetType,
  UpdateUserType,
  UserDetails,
} from "../types/AuthSchema";
import { loadLocalCart } from "../utils/localStorage";
import { addItemsToCartApi } from "./apiCart";
import customFetch, { authFetch } from "./customFetch";

const API_END_POINT_URL = "/api/authservice/auth";

export async function register(registerData: RegisterUserType) {
  const { data } = await authFetch.post(
    `${API_END_POINT_URL}/register`,
    registerData
  );

  return data as {
    sessionId: string;
  };
}

export async function verifyOtpApi(data: {
  sessionId: string;
  otp: string;
  newPassword?: string;
}) {
  // Call the endpoint and destructure tokens from the response
  const {
    data: { accessToken, refreshToken },
  } = await authFetch.post(`${API_END_POINT_URL}/verify-otp`, data);

  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    customFetch.defaults.headers.Authorization = `Bearer ${accessToken}`;
  }
}

export async function resendOtpApi(sessionId: string) {
  await authFetch.post(`${API_END_POINT_URL}/resend-otp`, undefined, {
    params: { sessionId },
  });
}

export async function requestPasswordResetApi(
  request: RequestPasswordResetType
) {
  const { data } = await authFetch.post(
    `${API_END_POINT_URL}/request-reset-password`,
    undefined,
    { params: { identifier: request?.email || request?.phoneNumber } }
  );

  return data as {
    sessionId: string;
  };
}

export async function login(loginData: LoginType) {
  const fcmToken = await getFcmToken();

  const {
    data: { accessToken, refreshToken, sessionId },
  } = await authFetch.post(`${API_END_POINT_URL}/login`, {
    identifier: loginData?.email || loginData?.phoneNumber,
    password: loginData.password,
    deviceToken: fcmToken,
    platform: "web",
    isClient: true,
    deviceName: navigator.userAgent,
    appVersion: "1.0.0",
    deliveryMethod: loginData?.email ? "email" : "phone",
  });

  if (sessionId)
    return {
      sessionId,
    } as { sessionId: string };

  // Set Token
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  customFetch.defaults.headers.Authorization = `Bearer ${accessToken}`;

  // Merge Local Cart
  const localCart = loadLocalCart();
  if (localCart.length > 0) {
    try {
      await addItemsToCartApi(localCart); // send to backend

      localStorage.removeItem("local_cart"); // clear local cart
    } catch (err) {
      console.error("Failed to merge local cart after login:", err);
    }
  }
}

export async function signInWithGoogleApi({
  code,
  redirectUri = "postmessage",
}: {
  code: string;
  redirectUri?: string;
}) {
  const {
    data: { accessToken, refreshToken },
  } = await authFetch.post(`${API_END_POINT_URL}/social/callback`, {
    provider: "GOOGLE",
    code,
    redirectUri,
  });

  // Set Token
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  customFetch.defaults.headers.Authorization = `Bearer ${accessToken}`;

  // Merge Local Cart
  const localCart = loadLocalCart();
  if (localCart.length > 0) {
    try {
      await addItemsToCartApi(localCart); // send to backend

      localStorage.removeItem("local_cart"); // clear local cart
    } catch (err) {
      console.error("Failed to merge local cart after login:", err);
    }
  }
}

export async function signInWithFacebookApi({
  accessToken,
}: {
  accessToken: string;
}) {
  const {
    data: { accessToken: newAccessToken, refreshToken },
  } = await authFetch.post(`${API_END_POINT_URL}/social/callback`, {
    provider: "FACEBOOK",
    accessToken,
  });

  localStorage.setItem("accessToken", newAccessToken);
  localStorage.setItem("refreshToken", refreshToken);
  customFetch.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

  const localCart = loadLocalCart();
  if (localCart.length > 0) {
    try {
      await addItemsToCartApi(localCart);

      localStorage.removeItem("local_cart");
    } catch (err) {
      console.error("Failed to merge local cart after login:", err);
    }
  }
}

export async function refresh() {
  const oldRefreshToken = localStorage.getItem("refreshToken");
  if (!oldRefreshToken) return;
  // Use separate instance without interceptor
  const { data } = await authFetch.post(`${API_END_POINT_URL}/refresh-token`, {
    refreshToken: oldRefreshToken,
  });

  // Update tokens
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  customFetch.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
}

export async function logout() {
  const refreshToken = localStorage.getItem("refreshToken");
  const fcmToken = await getFcmToken();

  await customFetch.post(`${API_END_POINT_URL}/logout`, {
    deviceToken: fcmToken,
    refreshToken,
  });

  // Remove Token
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  delete customFetch.defaults.headers.Authorization;
}

export async function apiMe() {
  const oldAccessToken = localStorage.getItem("accessToken");
  const oldRefreshToken = localStorage.getItem("refreshToken");
  if (!oldAccessToken || !oldRefreshToken)
    throw new Error("Failed to refresh token, please login again");

  customFetch.defaults.headers.Authorization = `Bearer ${oldAccessToken}`;

  const { data } = await customFetch.get(`${API_END_POINT_URL}/me`);

  return data as UserDetails;
}

const API_USER_END_POINT_URL = "/api/authservice/users";

export async function updateUserApi(updateUserData: UpdateUserType) {
  const { data } = await customFetch.put(
    `${API_USER_END_POINT_URL}/me`,
    updateUserData
  );

  return data as UserDetails;
}

export async function uploadProfileImageApi({
  profileImage,
  userId,
}: {
  profileImage: File;
  userId: string;
}) {
  const formData = new FormData();
  formData.append("profileImage", profileImage);

  await customFetch.post(
    `${API_USER_END_POINT_URL}/${userId}/upload-profile-image`,
    formData
  );
}
export async function deleteProfileImageApi(userId: string) {
  await customFetch.delete(`${API_USER_END_POINT_URL}/${userId}/profile-image`);
}
