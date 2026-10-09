// components/TextMessage.tsx
import { Timestamp } from "firebase/firestore";
import { formatTimestamp } from "../../utils/dateUtils";
import { ChatMessage } from "./useChat";

type TextMessageProps = {
  own?: boolean;
  message: ChatMessage;
};

export default function TextMessage({ own, message }: TextMessageProps) {
  return (
    <div
      className={`flex w-full flex-col ${
        own ? "items-end" : "items-start"
      } mb-2`}
    >
      <div
        className={`relative max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
          own
            ? "bg-primary rounded-br-sm text-white"
            : "rounded-bl-sm bg-gray-100 text-gray-900"
        }`}
      >
        {/* Message Content */}
        {message.content && (
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
        )}

        {/* Timestamp */}
        <span
          className={`mt-1 block text-[10px] ${
            own ? "text-gray-200" : "text-gray-500"
          } text-right`}
        >
          {formatTimestamp(message.timestamp || Timestamp.now())}
        </span>
      </div>
    </div>
  );
}
