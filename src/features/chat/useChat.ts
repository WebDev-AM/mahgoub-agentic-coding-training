import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

// Define a more specific type for messages
export type ChatMessage = {
  id?: string;
  content?: string;
  sender: string;
  receiver: string;
  relation: string;
  isRead: boolean;
  timestamp: Timestamp;
  type?: "text" | "order" | "reservation";
  attachment?: string | null;
} & DocumentData;

export default function useChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const docRef = doc(db, import.meta.env.VITE_CUSTOMER_SERVICE_CHAT, userId);
    const messagesCollection = collection(docRef, "messages");

    const q = query(messagesCollection, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const newMessages = querySnapshot.docs.map((doc) => ({
        ...(doc.data() as ChatMessage),
        id: doc.id,
      }));

      setMessages(newMessages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { isLoading, messages };
}
