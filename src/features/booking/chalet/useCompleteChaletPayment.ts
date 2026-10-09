import { useState } from "react";
import { completeChaletPaymentApi } from "../../../services/apiChalets";
import { CompletePaymentType } from "../../../types/reservation/ReservationsSchema";

export function useCompleteChaletPayment() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const completePayment = async (paymentDetails: CompletePaymentType) => {
    setIsCreating(true);
    setError(null);

    try {
      const { paymentUrl } = await completeChaletPaymentApi(paymentDetails);
      window.location.href = paymentUrl; // Automatically open the payment URL
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    error,
    completePayment,
  };
}
