import { useState } from "react";
import { Button } from "@mui/material";
import { t } from "i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useChaletReservation } from "../../reservation/chalet/useChaletReservation";
import PageSpinner from "../../../ui/PageSpinner";
import ApplyChaletPromocode from "./ApplyChaletPromocode";
import ChaletBookingSummaryPanel, {
  ChaletBookingSummaryData,
} from "./ChaletBookingSummaryPanel";
import { PromoCodeUsage } from "../../../types/reservation/ReservationsSchema";
import i18n from "../../../i18n";
import dayjs from "dayjs";
import { FiShield } from "react-icons/fi";
import { useWallet } from "../../reservation/useWallet";

function ChaletBookingInformation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const { isLoading, error, reservation } = useChaletReservation(
    reservationId || undefined
  );
  const { wallet } = useWallet();

  const [appliedPromo, setAppliedPromo] = useState<PromoCodeUsage | null>(null);

  if (isLoading) return <PageSpinner />;
  if (error || !reservation || !reservation.unit) return <Navigate to="/" />;

  const summary: ChaletBookingSummaryData = {
    chalet: reservation.unit,
    numberOfNights: reservation.numberOfNights || 0,
    subtotal: reservation.subtotal || 0,
    insurance: reservation.insurance || 0,
    insurancePaidAtArrival: reservation.insurancePaidAtArrival || 0,
    discount: appliedPromo?.appliedDiscount,
    walletBalance: wallet?.balance,
    startDate: reservation.begin,
    endDate: reservation.end,
  };

  const price = reservation.subtotal || 0;
  const insurance = reservation.insurance || 0;
  const insurancePaidAtArrival = reservation.insurancePaidAtArrival || 0;
  const numberOfNights = reservation.numberOfNights || 0;
  const total = price + insurance - (appliedPromo?.appliedDiscount || 0);

  const chaletName =
    i18n.language === "ar"
      ? reservation.unit.localizedData?.nameAr
      : reservation.unit.localizedData.nameEn;
  const chaletAddress =
    i18n.language === "en"
      ? reservation.unit.localizedData.addressEn
      : reservation.unit.localizedData.addressAr;

  function handleNext() {
    const params = new URLSearchParams();
    params.set("reservationId", reservation!.uuid);

    if (appliedPromo?.usageId) {
      params.set("usageId", appliedPromo.usageId);
      params.set("discount", String(appliedPromo.appliedDiscount || 0));
    }

    navigate(`/booking/chalet/2?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-heading text-xl font-bold">
          {t("Booking Information")}
        </h2>
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <ChaletBookingSummaryPanel summary={summary} />

        <div className="sticky top-5 flex w-full flex-col gap-4 rounded-2xl py-5 lg:w-[420px]">
          {/* Header */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500">
              {t("Booking Summary")}
            </h3>

            <div className="mt-3 flex gap-3">
              <img
                src={reservation.unit.media[0].url}
                alt={chaletName}
                className="h-14 w-20 rounded-lg object-cover"
              />

              <div>
                <p className="text-sm font-semibold">{chaletName}</p>
                <p className="text-xs text-gray-500">{chaletAddress}</p>
                <div className="mt-1 text-xs text-yellow-400">★★★★★</div>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">{chaletName}</p>
              <p className="text-xs text-gray-500">
                {dayjs(reservation.begin)
                  .locale(i18n.language)
                  .format("DD MMM")}{" "}
                -{" "}
                {dayjs(reservation.end).locale(i18n.language).format("DD MMM")}
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
              {numberOfNights} {t(numberOfNights > 1 ? "Nights" : "Night")}
            </span>
          </div>

          <div className="border-t border-gray-200" />

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">{t("Subtotal")}</span>
              <span>
                {price} {t("KWD")}
              </span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-green-600">
                <span>{t("Member discount")}</span>
                <span>
                  -{appliedPromo.appliedDiscount} {t("KWD")}
                </span>
              </div>
            )}

            {insurance > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">{t("Refundable Deposit")}</span>
                <span>
                  {insurance} {t("KWD")}
                </span>
              </div>
            )}
          </div>

          {/* Promo */}
          <ApplyChaletPromocode
            order={reservation}
            appliedPromo={appliedPromo}
            setAppliedPromo={setAppliedPromo}
          />

          <div className="border-t border-gray-200" />

          {/* Total */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t("Total")}</span>
              <span className="text-xl font-bold text-blue-600">
                {total} {t("KWD")}
              </span>
            </div>

            {wallet?.balance !== undefined && wallet.balance < 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t("Debited wallet")}</span>
                <span className="font-semibold text-red-400">
                  {Math.abs(wallet.balance)} {t("KWD")}
                </span>
              </div>
            )}

            <p className="text-xs text-gray-500">
              {t("Includes taxes • No hidden fees")}
            </p>

            {insurancePaidAtArrival > 0 && (
              <div className="flex justify-between rounded-lg border border-amber-200 bg-amber-50 p-2 text-sm">
                <span className="flex items-start gap-1 text-gray-500">
                  <FiShield className="text-lg text-amber-500" />
                  {t("Refundable Deposit")}
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold">
                    {insurancePaidAtArrival} {t("KWD")}
                  </span>
                  <span>{t("Pay at Check-in")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
            <p>• {t("Instant booking confirmation")}</p>
            <p>• {t("Secure 256-bit SSL payment")}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              className="!bg-primary hover:!bg-primary-shade !h-11 !rounded-lg"
              variant="contained"
              onClick={handleNext}
            >
              🔒 {t("Confirm & pay")}
            </Button>

            <Button
              className="!h-11 !rounded-lg"
              variant="outlined"
              onClick={() => navigate(`/chalet/${reservation.unit?.id}`)}
            >
              {t("Edit booking")}
            </Button>
          </div>

          {reservation?.unit?.reservationType === "DAILY" && (
            <div className="text-xs text-gray-500">
              <p>{t("Price per night")}</p>
              <p className="text-sm font-semibold text-blue-600">
                {(price / numberOfNights).toFixed(2)} {t("KWD")} / {t("night")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChaletBookingInformation;
