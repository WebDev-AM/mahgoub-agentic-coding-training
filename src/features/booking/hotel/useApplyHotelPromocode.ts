import { useState } from "react";
import { applyHotelPromocodeApi } from "../../../services/apiHotels";

export function useApplyHotelPromocode() {
  const [isApplying, setIsApplying] = useState(false);

  const applyPromocode = async (code: string, reservationId: string) => {
    setIsApplying(true);
    try {
      const result = await applyHotelPromocodeApi(code, reservationId);
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    } finally {
      setIsApplying(false);
    }
  };

  return { isApplying, applyPromocode };
}
