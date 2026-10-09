import { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

import { useHotelCartContext } from "../../../contexts/HotelCartContext";
import { useCreateHotelReservation } from "./useCreateHotelReservation";
import { useMe } from "../../authentication/useMe";
import AuthForms from "../../authentication/AuthForms";
import SelectUser from "../SelectUser";
import HotelBookingSummaryPanel, {
  HotelBookingSummaryData,
} from "./HotelBookingSummaryPanel";
import { useWallet } from "../../reservation/useWallet";

function HotelBookingSummary() {
  const navigate = useNavigate();
  const { user } = useMe();
  const { wallet } = useWallet();
  const { createReservation, isCreating } = useCreateHotelReservation();
  const { cartItem } = useHotelCartContext();
  const isOwnerShare =
    new URL(window.location.href).searchParams.has("owner") ||
    Boolean(sessionStorage.getItem("session_owner"));

  const [agreed, setAgreed] = useState(false);

  const hotel = cartItem?.hotel ?? null;

  const subtotal = useMemo(() => {
    if (!cartItem?.selectedRooms?.length || !cartItem.numberOfNights) return 0;
    return cartItem.selectedRooms.reduce(
      (acc, item) =>
        acc +
        item.unitType.pricingDetails.dailyPrice *
          item.count *
          cartItem.numberOfNights,
      0
    );
  }, [cartItem]);

  const insurance = useMemo(() => {
    if (!cartItem?.selectedRooms?.length) return 0;
    return cartItem.selectedRooms.reduce(
      (acc, item) =>
        acc + item.unitType.pricingDetails.insurancePrice * item.count,
      0
    );
  }, [cartItem]);

  if (!hotel) return null;

  const summary: HotelBookingSummaryData = {
    hotel,
    rooms: cartItem?.selectedRooms || [],
    numberOfNights: cartItem?.numberOfNights || 0,
    subtotal,
    insurance,
    walletBalance: wallet?.balance,
    startDate: cartItem?.checkIn || "",
    endDate: cartItem?.checkOut || "",
    guests: cartItem?.numberOfGuests,
  };

  function handleNext() {
    if (!user || !cartItem || !cartItem.checkIn || !cartItem.checkOut) return;

    const requestedRoomsPerUnitType = cartItem.selectedRooms.reduce(
      (acc, item) => {
        acc[String(item.unitType.id)] = item.count;
        return acc;
      },
      {} as Record<string, number>
    );

    createReservation(
      {
        requestedRoomsPerUnitType,
        promoterId: sessionStorage.getItem("session_promoter"),
        begin: cartItem.checkIn,
        end: cartItem.checkOut,
        source: isOwnerShare ? "OWNER_SHARE" : undefined,
      },
      {
        onSuccess: (data) =>
          navigate(`/booking/hotel/1?reservationId=${data.uuid}`),
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
        <HotelBookingSummaryPanel summary={summary} />

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
              disabled={
                !user ||
                !agreed ||
                isCreating ||
                !cartItem?.selectedRooms?.length
              }
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

export default HotelBookingSummary;
