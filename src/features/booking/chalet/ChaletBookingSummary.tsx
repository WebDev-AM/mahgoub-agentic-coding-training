import { useState } from "react";
import { Button } from "@mui/material";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { useChaletCartContext } from "../../../contexts/ChaletCartContext";
import { useCreateChaletReservation } from "./useCreateChaletReservation";
import { useMe } from "../../authentication/useMe";
import AuthForms from "../../authentication/AuthForms";
import SelectUser from "../SelectUser";
import ChaletBookingSummaryPanel, {
  ChaletBookingSummaryData,
} from "./ChaletBookingSummaryPanel";
import { Chalet } from "../../../types/ChaletSchema";
import { useCreateChaletDraftReservation } from "./useCreateChaletDraftReservation";
import PageSpinner from "../../../ui/PageSpinner";
import { useWallet } from "../../reservation/useWallet";

function ChaletBookingSummary() {
  const navigate = useNavigate();
  const { user } = useMe();
  const { wallet } = useWallet();
  const { createReservation, isCreating } = useCreateChaletReservation();
  const { cartItem } = useChaletCartContext();
  const isOwnerShare =
    new URL(window.location.href).searchParams.has("owner") ||
    Boolean(sessionStorage.getItem("session_owner"));
  console.log(cartItem);
  const { reservation, isLoading } = useCreateChaletDraftReservation({
    begin: cartItem?.startDate + "T00:00:00Z" || "",
    end: cartItem?.endDate + "T23:59:59Z" || "",
    chaletId: cartItem?.chalet.uuid || "",
    source: isOwnerShare ? "OWNER_SHARE" : undefined,
  });

  const [agreed, setAgreed] = useState(false);

  if (isLoading) return <PageSpinner />;

  if (!cartItem?.chalet || (!isLoading && !reservation)) return null;

  const chalet = cartItem.chalet as Chalet;

  const summary: ChaletBookingSummaryData = {
    chalet,
    numberOfNights: reservation!.numberOfNights,
    subtotal: reservation!.subtotal,
    insurance: reservation!.insurance,
    insurancePaidAtArrival: reservation!.insurancePaidAtArrival,
    walletBalance: wallet?.balance,
    startDate: reservation!.begin,
    endDate: reservation!.end,
  };

  function handleNext() {
    if (!user || !cartItem) return;

    createReservation(
      {
        chaletId: chalet.uuid,
        begin: `${cartItem.startDate}T12:03:00Z`,
        end: `${cartItem.endDate}T01:57:00Z`,
        promoterId: sessionStorage.getItem("session_promoter") || undefined,
        source: isOwnerShare ? "OWNER_SHARE" : undefined,
      },
      {
        onSuccess: (data) =>
          navigate(`/booking/chalet/1?reservationId=${data.uuid}`),
      }
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-heading text-xl font-bold">{t("Summary")}</h2>
        <p className="text-sub-text text-sm">
          {t("Please fill up the blank fields below")}
        </p>
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <ChaletBookingSummaryPanel summary={summary} />

        <div className="sticky top-5 flex w-full flex-col gap-6 lg:w-[420px]">
          {!user ? (
            <AuthForms className="min-w-full! md:py-6" />
          ) : (
            <SelectUser />
          )}

          <div className="flex items-center gap-2">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            <label htmlFor="terms" className="text-gray-text text-sm">
              {t("I agree for all")}{" "}
              <a
                href="/terms.pdf"
                className="text-blue-500"
                target="_blank"
                rel="noreferrer"
              >
                {t("terms and conditions")}
              </a>
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              className="!bg-primary hover:!bg-primary-shade h-10 flex-1 disabled:!bg-gray-400"
              variant="contained"
              disabled={!user || !agreed || isCreating}
              onClick={handleNext}
            >
              {t("Next")}
            </Button>
            <Button
              className="h-10 flex-1"
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              {t("Cancel")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChaletBookingSummary;
