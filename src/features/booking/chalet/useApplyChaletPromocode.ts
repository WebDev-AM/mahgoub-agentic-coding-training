import { useState } from "react";
import { applyChaletPromocodeApi } from "../../../services/apiChalets";

export function useApplyChaletPromocode() {
  const [isApplying, setIsApplying] = useState(false);

  const applyPromocode = async (code: string, reservationId: string) => {
    setIsApplying(true);
    try {
      const result = await applyChaletPromocodeApi(code, reservationId);
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    } finally {
      setIsApplying(false);
    }
  };

  return { isApplying, applyPromocode };
}
