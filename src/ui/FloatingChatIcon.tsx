import { Link, useLocation } from "react-router-dom";
import { FaComments } from "react-icons/fa";
import { useMe } from "../features/authentication/useMe";
import PopoverComponent from "./PopoverComponent";
import { Chat } from "../pages";

function FloatingChatIcon() {
  const location = useLocation();
  const { user } = useMe();
  if (location.pathname === "/customer-service" || !user) return null;
  return (
    <>
      <PopoverComponent
        className="xs:block hidden"
        openButton={
          <button
            className="fixed right-5 bottom-20 z-9999 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/50 transition-colors duration-200 hover:bg-blue-700"
            title="Customer Service Chat"
          >
            <FaComments size={28} />
          </button>
        }
      >
        <Chat />
      </PopoverComponent>
      <Link
        to="/customer-service"
        className="xs:hidden fixed right-5 bottom-20 z-9999 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/50 transition-colors duration-200 hover:bg-blue-700"
        title="Customer Service Chat"
      >
        <FaComments size={28} />
      </Link>
    </>
  );
}

export default FloatingChatIcon;
