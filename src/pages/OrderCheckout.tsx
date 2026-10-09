import { useParams } from "react-router-dom";
import BackArrow from "../ui/BackArrow";
import OrderPesonalInfoStep from "../features/orderServices/checkout/OrderPesonalInfoStep";
import OrderPaymentStep from "../features/orderServices/checkout/OrderPaymentStep";
import CheckoutStepper from "../features/orderServices/checkout/CheckoutStepper";
import OrderSuccessPayment from "../features/orderServices/checkout/OrderSuccessPayment";
import OrderFailPayment from "../features/orderServices/checkout/OrderFailPayment";
import OrderCreateStep from "../features/orderServices/checkout/OrderCreateStep";

function OrderCheckout() {
  const { step, passedValue } = useParams();
  return (
    <div className="container-fix container flex flex-col gap-10 py-10">
      <BackArrow label="Checkout" />
      <CheckoutStepper />
      {step === "0" && <OrderPesonalInfoStep />}
      {step === "1" && <OrderCreateStep />}
      {step === "2" && passedValue?.startsWith("ORD") && <OrderPaymentStep />}
      {step === "3" && passedValue === "success" && <OrderSuccessPayment />}
      {step === "3" && passedValue === "fail" && <OrderFailPayment />}
    </div>
  );
}

export default OrderCheckout;
