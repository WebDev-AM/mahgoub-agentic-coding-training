import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getMessaging,
  onMessage,
  getToken,
  Messaging,
} from "firebase/messaging";
import { toast } from "react-toastify";
import NotificationToast from "./ui/NotificationToast";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const messaging: Messaging = getMessaging(app);

/**
 * Initializes Firebase messaging:
 * - Requests notification permission and gets FCM token
 * - Listens to foreground messages
 * - Registers service worker for background messages
 */
let currentFcmToken: string | null = null;

export async function getFcmToken(): Promise<string | null> {
  if (currentFcmToken) return currentFcmToken;
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    currentFcmToken = token;
  } catch (err) {
    console.error("Failed to get FCM token:", err);
  }
  return currentFcmToken;
}

export async function initFirebaseMessaging(): Promise<void> {
  requestNotificationPermissionAndToken();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onForegroundMessage((payload: any) => {
    console.log("Foreground message received:", payload);
    const { title, body } = payload?.notification || {};

    if (title && body) {
      toast.info(NotificationToast, {
        data: { title, body },
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.info("You have a new message.");
    }
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then(() => console.log("Firebase Service Worker registered"))
      .catch((err) => console.error("Service Worker registration failed", err));
  }
}

/**
 * Request browser notification permission and obtain FCM token.
 */
export async function requestNotificationPermissionAndToken() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Notification permission not granted.");
    return null;
  }

  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });
    currentFcmToken = token;
    return token;
  } catch (err) {
    console.error("Failed to get FCM token:", err);
    return null;
  }
}

/**
 * Listen for FCM messages when the app is in the foreground.
 */
function onForegroundMessage(handler: (payload: unknown) => void): void {
  onMessage(messaging, handler);
}
