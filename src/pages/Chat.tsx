import { Navigate } from "react-router-dom";
import { useMe } from "../features/authentication/useMe";
import ChatHeader from "../features/chat/ChatHeader";
import ChatWindow from "../features/chat/ChatWindow";
import PageSpinner from "../ui/PageSpinner";

export default function ChatPage() {
  const { isLoading, user } = useMe();
  if (isLoading) return <PageSpinner />;
  if (!user) return <Navigate to="/" />;

  return (
    <div className="xs:p-3 container mx-auto">
      <div className="xs:h-140 xs:min-w-120 flex h-[calc(100vh-4rem)] flex-col rounded-2xl border border-gray-300 bg-white shadow-lg">
        <ChatHeader />
        <div className="flex-1 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}
