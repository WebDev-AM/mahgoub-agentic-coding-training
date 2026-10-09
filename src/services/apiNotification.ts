import { PushNotificationType } from "../types/NotificationsSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/authservice/notification";

export async function pushNotificationToPortalApi(data: PushNotificationType) {
  await customFetch.post(`${API_END_POINT_URL}/portal/push-all`, data);
}
