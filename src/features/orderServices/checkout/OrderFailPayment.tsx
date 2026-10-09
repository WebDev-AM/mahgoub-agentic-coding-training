import { t } from "i18next";
import { Link } from "react-router-dom";

function OrderFailPayment() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="mt-6 h-50 w-40">
        <img className="max-w-40" src="/fail.gif" alt="fail" />
      </div>
      <h2 className="h2">{t("Payment Failed")}</h2>
      <p className="text-center font-bold">
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
        <Link
          to="/order-checkout/1"
          className="rounded-lg bg-blue-500 px-5 py-2 text-center text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 sm:w-auto"
        >
          {t("Try Again")}
        </Link>
      </div>
    </div>
  );
}

export default OrderFailPayment;
