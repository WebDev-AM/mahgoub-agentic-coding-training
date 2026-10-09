// const NotificationTypes = [
//   "PROMOTIONAL",
//   "REMINDER",
//   "FEEDBACK",
//   "NEWS",
//   "EVENT",
//   "REWARD",
//   "UPGRADE",
//   "REVIEW",
//   "DELIVERY",
//   "SUBSCRIPTION",
//   "CHAT",
//   "SYSTEM",
//   "RESERVATION",
//   "PAYMENT",
//   "ACCOUNT",
//   "SECURITY",
//   "ERROR",
//   "CANCELLATION",
// ];

export type PushNotificationType = {
  title: string;
  type: "CHAT";
  message: string;
};

export type BellNotificationsType = "MY";
