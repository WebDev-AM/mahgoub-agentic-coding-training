import { Avatar, Divider } from "@mui/material";
import { t } from "i18next";
import { FaCheckCircle } from "react-icons/fa";
import { useMe } from "../authentication/useMe";
import useLogout from "../authentication/useLogout";
import { motion } from "framer-motion";

function SelectUser({
  signInWithAnotherAccount = true,
}: {
  signInWithAnotherAccount?: boolean;
}) {
  const { user } = useMe();
  const { logout, isLoggingOut } = useLogout();
  return (
    <motion.div
      className="gap-inside-spacing-y flex w-full max-w-160 flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-primary font-medium">
        {t("Continue with this account")}
      </p>
      <div className="flex items-center gap-4">
        <Avatar className="!h-25 !w-25" src={user?.profileImage} />
        <div className="flex flex-1 flex-col gap-2">
          <span className="font-bold">{`${user?.firstName} ${user?.lastName}`}</span>
          <span className="text-gray-500">{`${user?.email}`}</span>
        </div>
        <div className="text-primary xs:flex hidden items-center gap-4">
          <FaCheckCircle className="text-3xl" /> {t("Verified")}
        </div>
      </div>
      {signInWithAnotherAccount && (
        <>
          <div>
            <Divider>{t("OR")}</Divider>
          </div>
          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="bg-primary/25 hover:bg-primary-shade/35 text-primary-shade h-10 cursor-pointer rounded-sm font-bold transition-all disabled:bg-gray-400"
          >
            {t("Sign in with another account")}
          </button>
        </>
      )}
    </motion.div>
  );
}

export default SelectUser;
