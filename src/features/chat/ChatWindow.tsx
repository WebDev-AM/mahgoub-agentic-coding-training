import MessageInput from "./MessageInput";
import Messages from "./Messages";

export default function ChatWindow() {
  return (
    <div className="grid h-full grid-rows-[1fr_auto] overflow-hidden">
      <Messages />
      <MessageInput />
    </div>
  );
}
