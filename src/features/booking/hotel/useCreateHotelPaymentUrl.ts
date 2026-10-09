import { useState } from "react";
import { createHotelPaymentUrlApi } from "../../../services/apiHotels";
import { CreateHotelPaymentType } from "../../../types/reservation/HotelResevationSchema";

export function useCreateHotelPaymentUrl() {
  const [error, setError] = useState<unknown>(null);

  const createPaymentUrl = async (paymentDetails: CreateHotelPaymentType) => {
    setError(null);

    try {
      const { paymentUrl } = await createHotelPaymentUrlApi(paymentDetails);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err);
      return { error: err };
    }
  };

  return {
    error,
    createPaymentUrl,
  };
}
