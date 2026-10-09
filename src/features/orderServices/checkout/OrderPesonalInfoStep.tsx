import { useNavigate } from "react-router-dom";
import OrderSummary from "../cart/OrderSummary";
import { t } from "i18next";
import { useMe } from "../../authentication/useMe";
import AuthForms from "../../authentication/AuthForms";
import SelectUser from "../../booking/SelectUser";

function OrderPesonalInfoStep() {
  const navigate = useNavigate();
  const { user } = useMe();
  return (
    <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start">
      <div className="flex flex-1 justify-center">
        {!user ? (
          <AuthForms className="w-full md:w-[60%]" />
        ) : (
          <SelectUser signInWithAnotherAccount={false} />
        )}
      </div>
      <OrderSummary>
        <button
          onClick={() => navigate("/order-checkout/1")}
          disabled={!user}
          className="bg-primary hover:bg-primary-shade flex h-12 w-full cursor-pointer items-center justify-center text-lg font-semibold text-white transition hover:shadow-2xl disabled:bg-gray-500"
        >
          {t("Next")}
        </button>
      </OrderSummary>
    </div>
  );
}

export default OrderPesonalInfoStep;
