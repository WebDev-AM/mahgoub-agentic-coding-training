import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useChaletCartContext } from "../contexts/ChaletCartContext";
import BookingStepper from "../features/booking/BookingStepper";
import ChaletBookingSummary from "../features/booking/chalet/ChaletBookingSummary";
import ChaletBookingInformation from "../features/booking/chalet/ChaletBookingInformation";
import ChaletBookingPaymentConfirmation from "../features/booking/chalet/ChaletBookingPaymentConfirmation";

function ChaletBooking() {
  const { cartItem } = useChaletCartContext();
  const { step } = useParams();
  const renderStep = parseInt(step ?? "0", 10);

  if (cartItem === null && renderStep === 0) return <Navigate to="/" />;

  return (
    <div className="gap-spacing-y container-fix container flex flex-col py-6">
      <BookingStepper />
      <div className="flex flex-col items-center justify-center gap-20 lg:flex-row lg:items-start">
        {renderStep === 0 && <ChaletBookingSummary />}
        {renderStep === 1 && <ChaletBookingInformation />}
        {renderStep >= 2 && <ChaletBookingPaymentConfirmation />}
      </div>
    </div>
  );
}

export default ChaletBooking;
