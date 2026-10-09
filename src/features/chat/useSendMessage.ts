import { useMutation } from "@tanstack/react-query";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

interface SendMessageParams {
  text: string;
  id: string;
  type?: "text" | "order" | "reservation";
  attachment?: string | null;
}

async function sendMessageApi({
  text,
  id,
  type = "text",
  attachment = null,
}: SendMessageParams): Promise<void> {
  if ((!text && !attachment) || !id) return;

  const userDocRef = doc(db, import.meta.env.VITE_CUSTOMER_SERVICE_CHAT, id);

  await setDoc(
    userDocRef,
    {
      content: text,
      sender: id,
      receiver: "customerService",
      relation: "customerService_USER",
      isRead: false,
      timestamp: serverTimestamp(),
      type,
      attachment,
    },
    { merge: true }
  );

  const messagesCollectionRef = collection(userDocRef, "messages");

  await addDoc(messagesCollectionRef, {
    content: text,
    sender: id,
    receiver: "customerService",
    relation: "customerService_USER",
    isRead: false,
    timestamp: serverTimestamp(),
    type,
    attachment,
  });
}

export default function useSendMessage() {
  const { mutate: sendMessage, isPending } = useMutation<
    void,
    Error,
    SendMessageParams
  >({
    mutationFn: sendMessageApi,
  });

  return { sendMessage, isPending };
}
