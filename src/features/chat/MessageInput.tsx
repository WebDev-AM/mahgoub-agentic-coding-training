import { FormEvent, useState } from "react";
import useSendMessage from "./useSendMessage";
import { t } from "i18next";
import { CircularProgress } from "@mui/material";
import { useMe } from "../authentication/useMe";
import { usePushToPortal } from "../../hooks/usePushToPortal";

export default function MessageInput() {
  const [text, setText] = useState("");
  const { user } = useMe();
  const { sendMessage, isPending } = useSendMessage();
  const { pushNotificationToPortal } = usePushToPortal();
  function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!text) return;
    sendMessage(
      { text, id: user!.id },
      {
        onSuccess: () => {
          pushNotificationToPortal({
            title: `${user?.firstName} ${user?.lastName}`,
            message: `Message: ${text}`,
            type: "CHAT",
          });
          setText("");
        },
      }
    );
  }
  return (
    <form
      className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3"
      onSubmit={handleSendMessage}
    >
      <input
        type="text"
        placeholder={t("Type a message...")}
        className="focus:border-primary focus:ring-primary flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-offset-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPending}
      />
      <button
        className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-medium text-white shadow-md transition-all disabled:cursor-not-allowed disabled:bg-gray-400"
        type="submit"
        disabled={!text || isPending}
      >
        {isPending ? <CircularProgress size={20} /> : t("Send")}
      </button>
    </form>
  );
}
