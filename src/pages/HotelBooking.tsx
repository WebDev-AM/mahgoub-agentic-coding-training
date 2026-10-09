import { Navigate, useParams } from "react-router-dom";

import { useHotelCartContext } from "../contexts/HotelCartContext";
import BookingStepper from "../features/booking/BookingStepper";
import HotelBookingSummary from "../features/booking/hotel/HotelBookingSummary";
import HotelBookingInformation from "../features/booking/hotel/HotelBookingInformation";
import HotelBookingPaymentConfirmation from "../features/booking/hotel/HotelBookingPaymentConfirmation";

function HotelBooking() {
  const { cartItem } = useHotelCartContext();
  const { step } = useParams();
  const renderStep = parseInt(step ?? "0", 10);

  if (cartItem === null && renderStep === 0) return <Navigate to="/" />;

  return (
    <div className="gap-spacing-y container-fix container flex flex-col py-6">
      <BookingStepper />
      <div className="flex flex-col items-center justify-center gap-20 lg:flex-row lg:items-start">
        {renderStep === 0 && <HotelBookingSummary />}
        {renderStep === 1 && <HotelBookingInformation />}
        {renderStep >= 2 && <HotelBookingPaymentConfirmation />}
      </div>
    </div>
  );
}

export default HotelBooking;
