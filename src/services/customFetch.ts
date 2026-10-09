import axios from "axios";
import { refresh } from "./apiAuth";
import { queryClient } from "./reactQueryClient";

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach an interceptor to handle token refresh
customFetch.interceptors.response.use(
  // Successful response: return it as-is
  (response) => response,

  // Error response handling
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent retry loops

      try {
        // Attempt to refresh the token
        await refresh(); // This should update the token in localStorage and axios default headers

        // Update the original request with the new token
        originalRequest.headers["Authorization"] =
          `Bearer ${localStorage.getItem("accessToken")}`;

        // Retry the original request
        return customFetch(originalRequest);
      } catch {
        // Clear all auth artifacts
        localStorage.clear();
        queryClient.setQueryData(["me"], null);
        queryClient.clear();
        delete customFetch.defaults.headers.Authorization;
        return Promise.reject(new Error("Session expired"));
      }
    }

    // If it's not a 401 error or retry failed, just forward the error
    return Promise.reject(error);
  }
);

// Add this to your code
export const authFetch = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default customFetch;
