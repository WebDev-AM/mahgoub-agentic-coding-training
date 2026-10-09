import { useState } from "react";
import { Button } from "@mui/material";
import { t } from "i18next";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useHotelReservation } from "../../reservation/hotel/useHotelReservation";
import PageSpinner from "../../../ui/PageSpinner";
import ApplyHotelPromocode from "./ApplyHotelPromocode";
import HotelBookingSummaryPanel, {
  HotelBookingSummaryData,
} from "./HotelBookingSummaryPanel";
import { PromoCodeUsage } from "../../../types/reservation/ReservationsSchema";
import i18n from "../../../i18n";
import dayjs from "dayjs";
import { useWallet } from "../../reservation/useWallet";

function HotelBookingInformation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");

  const { isLoading, error, reservation } = useHotelReservation(
    reservationId || undefined
  );
  const { wallet } = useWallet();

  const [appliedPromo, setAppliedPromo] = useState<PromoCodeUsage | null>(null);

  if (isLoading) return <PageSpinner />;
  if (error || !reservation || !reservation.hotel) return <Navigate to="/" />;

  const numberOfNights = Math.max(
    0,
    dayjs(reservation.end).diff(dayjs(reservation.begin), "day")
  );

  const summary: HotelBookingSummaryData = {
    hotel: reservation.hotel,
    rooms: reservation.groupUnitTypes,
    numberOfNights,
    subtotal: reservation.totalSubtotal || 0,
    insurance: reservation.totalInsurance || 0,
    discount: appliedPromo?.appliedDiscount,
    walletBalance: wallet?.balance,
    startDate: reservation.begin,
    endDate: reservation.end,
  };

  const total =
    summary.subtotal + summary.insurance - (appliedPromo?.appliedDiscount || 0);

  const hotelName =
    i18n.language === "ar"
      ? reservation.hotel.localizedData?.nameAr
      : reservation.hotel.localizedData.nameEn;
  const hotelAddress =
    i18n.language === "en"
      ? reservation.hotel.localizedData.addressEn
      : reservation.hotel.localizedData.addressAr;

  function handleNext() {
    const params = new URLSearchParams();
    params.set("reservationId", reservation!.uuid);

    if (appliedPromo?.usageId) {
      params.set("usageId", appliedPromo.usageId);
      params.set("discount", String(appliedPromo.appliedDiscount || 0));
    }

    navigate(`/booking/hotel/2?${params.toString()}`);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-heading text-xl font-bold">
          {t("Booking Information")}
        </h2>
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <HotelBookingSummaryPanel summary={summary} />

        <div className="sticky top-5 flex w-full flex-col gap-4 rounded-2xl py-5 lg:w-[420px]">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">
              {t("Booking Summary")}
            </h3>

            <div className="mt-3 flex gap-3">
              <img
                src={reservation.hotel.media[0].url}
                alt={hotelName}
                className="h-14 w-20 rounded-lg object-cover"
              />

              <div>
                <p className="text-sm font-semibold">{hotelName}</p>
                <p className="text-xs text-gray-500">{hotelAddress}</p>
                <div className="mt-1 text-xs text-yellow-400">★★★★★</div>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">{hotelName}</p>
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

          <div className="space-y-2 text-sm">
            {reservation.groupUnitTypes.map((unit) => {
              const roomName =
                i18n.language === "ar"
                  ? unit.unitType.localizedData.nameAr
                  : unit.unitType.localizedData.nameEn;

              return (
                <div key={unit.unitType.id} className="flex justify-between">
                  <span className="text-gray-500">
                    {unit.count} {roomName}
                  </span>
                  <span>
                    {unit.totalSubtotal} {t("KWD")}
                  </span>
                </div>
              );
            })}

            <div className="flex justify-between">
              <span className="text-gray-500">{t("Room subtotal")}</span>
              <span>
                {summary.subtotal} {t("KWD")}
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

            <div className="flex justify-between">
              <span className="text-gray-500">{t("Insurance")}</span>
              <span>
                {summary.insurance} {t("KWD")}
              </span>
            </div>
          </div>

          <ApplyHotelPromocode
            order={reservation}
            appliedPromo={appliedPromo}
            setAppliedPromo={setAppliedPromo}
          />

          <div className="border-t border-gray-200" />

          <div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t("Total")}</span>
              <span className="text-xl font-bold text-blue-600">
                {total} {t("KWD")}
              </span>
            </div>

            {wallet?.balance !== undefined && wallet.balance < 0 && (
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-500">{t("Debited wallet")}</span>
                <span className="font-semibold text-red-400">
                  {Math.abs(wallet.balance)} {t("KWD")}
                </span>
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              {t("Includes taxes • No hidden fees")}
            </p>
          </div>

          <div className="space-y-1 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
            <p>• {t("Instant booking confirmation")}</p>
            <p>• {t("Secure 256-bit SSL payment")}</p>
          </div>

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
              onClick={() => navigate(`/hotel/${reservation.hotel.uuid}`)}
            >
              {t("Edit booking")}
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>{t("Price per night")}</p>
            <p className="text-sm font-semibold text-blue-600">
              {(summary.subtotal / numberOfNights).toFixed(2)} {t("KWD")} /{" "}
              {t("night")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelBookingInformation;
