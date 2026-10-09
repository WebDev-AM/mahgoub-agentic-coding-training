import { Timestamp } from "firebase/firestore";

export type Message = {
  id: string;
  content: string;
  isRead: boolean;
  receiver: string;
  sender: string;
  timestamp: Timestamp; // Firestore Timestamp type
};
