import { useState } from "react";
import { createChaletPaymentUrlApi } from "../../../services/apiChalets";
import { CreateChaletPaymentType } from "../../../types/reservation/ChaletReservationSchema";

export function useCreateChaletPaymentUrl() {
  const [error, setError] = useState<unknown>(null);

  const createPaymentUrl = async (paymentDetails: CreateChaletPaymentType) => {
    setError(null);

    try {
      const { paymentUrl } = await createChaletPaymentUrlApi(paymentDetails);
      window.location.href = paymentUrl; // Automatically open the payment URL
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
