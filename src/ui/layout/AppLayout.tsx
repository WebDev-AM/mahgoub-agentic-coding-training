import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import ContactUs from "./ContactUs";
import FloatingChatIcon from "../FloatingChatIcon";
import PersistCode from "./PersistCode";
import PageSpinner from "../PageSpinner";

function AppLayout() {
  return (
    <>
      <Header />
      <div className="overflowx-hidden position-relative min-h-[60vh]">
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </div>
      <FloatingChatIcon />
      <ContactUs />

      <PersistCode />
    </>
  );
}

export default AppLayout;
