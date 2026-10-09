import { motion } from "framer-motion";
import { t } from "i18next";
import { Link } from "react-router-dom";

function FailedReservation() {
  return (
    <motion.div
      className="mx-4 flex min-h-[60vh] flex-col items-center justify-center md:mx-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="mt-6 h-50 w-40">
        <img className="max-w-40" src="/fail.gif" alt="fail" />
      </div>
      <h3 className="text-xl font-bold text-red-500">{t("Failed Payment!")}</h3>
      <p className="mt-5 text-center font-bold">
        {t(
          "Thank you for your interest. but your payment was not successful. please try again."
        )}
      </p>
      <div className="mt-5 flex w-full items-center justify-center gap-x-3">
        <Link
          to="/"
          className="rounded-lg bg-blue-500 px-5 py-2 text-center text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 sm:w-auto"
        >
          {t("Take Me Home")}
        </Link>
      </div>
    </motion.div>
  );
}

export default FailedReservation;
