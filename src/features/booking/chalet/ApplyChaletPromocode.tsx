import { Dispatch, SetStateAction, useState } from "react";
import { t } from "i18next";

import { useApplyChaletPromocode } from "./useApplyChaletPromocode";

import { PromoCodeUsage } from "../../../types/reservation/ReservationsSchema";
import { ChaletReservation } from "../../../types/reservation/ChaletReservationSchema";

type ApplyChaletPromocodeProps = {
  order: ChaletReservation;
  appliedPromo: PromoCodeUsage | null;
  setAppliedPromo: Dispatch<SetStateAction<PromoCodeUsage | null>>;
};

function ApplyChaletPromocode({
  order,
  appliedPromo,
  setAppliedPromo,
}: ApplyChaletPromocodeProps) {
  const { isApplying, applyPromocode } = useApplyChaletPromocode();

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    if (!promoCodeInput) return;

    setError(null);

    const { data, error } = await applyPromocode(promoCodeInput, order.uuid!);

    if (error || !data) {
      setError(t("Invalid promo code"));
      setAppliedPromo(null);
      return;
    }

    setAppliedPromo(data);
  }

  function handleRemove() {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setError(null);
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Input Row */}
      <div className="flex overflow-hidden rounded-lg border border-gray-200">
        <input
          type="text"
          placeholder={t("Enter promo code")}
          value={promoCodeInput}
          disabled={!!appliedPromo}
          onChange={(e) => {
            setPromoCodeInput(e.target.value);
            if (error) setError(null);
          }}
          className="flex-1 p-3 text-sm outline-none disabled:bg-gray-100"
        />

        {appliedPromo ? (
          <button
            onClick={handleRemove}
            className="w-30 bg-red-100 px-4 text-sm font-medium text-red-600"
          >
            {t("Remove")}
          </button>
        ) : (
          <button
            onClick={handleApply}
            disabled={!promoCodeInput || isApplying}
            className="text-brand-blue bg-primary-light w-30 px-4 text-sm font-medium disabled:opacity-500"
          >
            {isApplying ? t("Applying...") : t("Apply")}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="px-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default ApplyChaletPromocode;
