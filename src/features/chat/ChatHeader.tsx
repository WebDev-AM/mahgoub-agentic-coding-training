import { t } from "i18next";

function ChatHeader() {
  return (
    <div className="bg-primary rounded-t-xl py-4 text-center text-xl font-semibold text-white shadow-md md:text-2xl">
      {t("Customer Service")}
    </div>
  );
}

export default ChatHeader;
