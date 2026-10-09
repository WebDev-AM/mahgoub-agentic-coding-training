import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdLocationOn,
  MdOutlineArrowRightAlt,
  MdOutlineInfo,
} from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";

import { AmenityItem, getAmenities } from "../../../utils/amenitiesUtils";
import { daysFormatDate } from "../../../utils/dateUtils";
import BookingSectionCard from "../BookingSectionCard";
import { Hotel } from "../../../types/HotelSchema";
import { Button } from "@mui/material";
import HotelRoomsSection from "./HotelRoomsSection";
import { HotelReservationUnit } from "../../../types/reservation/HotelResevationSchema";

export type HotelBookingSummaryData = {
  hotel: Hotel;
  rooms: HotelReservationUnit[];
  numberOfNights: number;
  subtotal: number;
  insurance: number;
  discount?: number;
  status?: string;
  walletBalance?: number;
  startDate: string;
  endDate: string;
  guests?: number;
};

function HotelBookingSummaryPanel({
  summary: {
    hotel,
    rooms,
    numberOfNights,
    subtotal,
    insurance,
    discount,
    startDate,
    endDate,
    guests,
    status,
    walletBalance,
  },
}: {
  summary: HotelBookingSummaryData;
}) {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const amenities = getAmenities(hotel);

  const hotelName =
    i18n.language === "en"
      ? hotel.localizedData.nameEn
      : hotel.localizedData.nameAr;

  const hotelDescription =
    i18n.language === "en"
      ? hotel.localizedData.descriptionEn
      : hotel.localizedData.descriptionAr;

  const hotelAddress =
    i18n.language === "en"
      ? hotel.localizedData.addressEn
      : hotel.localizedData.addressAr;

  const searchParamDiscount = Number(searchParams.get("discount") || 0);

  const appliedDiscount = discount ?? searchParamDiscount;

  const nightsLabel = t(numberOfNights > 1 ? "nights" : "night");
  const guestsLabel =
    typeof guests === "number" && guests > 0
      ? t(guests > 1 ? "guests" : "guest")
      : null;

  const totalRooms = rooms.reduce((acc, item) => acc + item.count, 0);

  const roomLineItems = rooms.map(({ unitType, ...rest }) => {
    const roomName =
      i18n.language === "en"
        ? unitType.localizedData.nameEn
        : unitType.localizedData.nameAr;
    const nightlyPrice = unitType.pricingDetails.dailyPrice || 0;

    return {
      id: unitType.id,
      roomName,
      nightlyPrice,
      ...rest,
    };
  });

  const amenityList = amenities.filter(
    ({ count, condition }) =>
      (count !== undefined && count > 0) || condition === true
  );

  const priorityLabels = [
    t("Parkings"),
    t("Common Pools"),
    t("Gardens"),
    t("Games"),
  ];

  const highlightedAmenities = [
    ...priorityLabels
      .map((label) => amenityList.find((item) => item.label === label))
      .filter((item): item is AmenityItem => Boolean(item)),
    ...amenityList.filter((item) => !priorityLabels.includes(item.label)),
  ].slice(0, 4);

  const highlightStyles = [
    "bg-primary-light text-primary-dark border border-primary/10",
    "bg-secondary text-gray-text border border-secondary-dark",
    "bg-light-gray text-gray-text border border-light-gray",
    "bg-primary-light text-primary-dark border border-primary/10",
  ];

  const entryTime = hotel.timeDetails.entryTime;
  const exitTime = hotel.timeDetails.exitTime;
  const reservationLimit = hotel.policyDetails.reservationLimitInDays;
  const total = subtotal + insurance - appliedDiscount;

  const isGrayscale = status === "CANCELLED" || status === "REPLACED";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="border-secondary-dark rounded-3xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="h-60 w-full overflow-hidden rounded-2xl md:h-72">
            <motion.img
              className={`${isGrayscale ? "grayscale" : ""} h-full w-full object-cover`}
              src={hotel.media?.[0]?.url}
              alt={hotelName}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <h3 className="text-heading text-xl font-bold">{hotelName}</h3>
              {hotelAddress && (
                <div className="text-sub-text mt-1 flex items-center gap-1 text-sm">
                  <MdLocationOn className="text-sub-text text-base" />
                  <span>{hotelAddress}</span>
                </div>
              )}
            </div>

            <div className="text-gray-dark-text flex flex-wrap gap-3 text-xs">
              {amenityList.map(({ label, icon: Icon, count }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="text-primary text-base" />
                  <span>{count ? `${count} ${label}` : label}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-text text-sm">{hotelDescription}</p>

            <div className="mt-1 flex flex-wrap gap-2">
              {highlightedAmenities.map((amenity, index) => (
                <span
                  key={amenity.label}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${highlightStyles[index % highlightStyles.length]}`}
                >
                  {amenity.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {rooms.length > 0 && <HotelRoomsSection rooms={rooms} />}

      <BookingSectionCard
        title={t("Price breakdown")}
        className="border-secondary-dark p-4"
      >
        {roomLineItems.length > 0 && (
          <div className="flex flex-col gap-2 text-sm">
            {roomLineItems.map((item) => (
              <div key={item.id}>
                <div className="flex flex-col gap-1">
                  <div className="text-brand-text flex items-center justify-between text-sm font-semibold">
                    <span>{item.roomName}</span>
                    <span>{`${item.totalCost} ${t("KWD")}`}</span>
                  </div>
                  <div className="text-sub-text flex items-center justify-between text-sm">
                    <span>{t("Rate per night")}</span>
                    <span>{`${item.nightlyPrice} ${t("KWD")}`}</span>
                  </div>
                  <div className="text-sub-text flex items-center justify-between text-sm">
                    <span>{t("Nights")}</span>
                    <span>{`${numberOfNights} ${nightsLabel}`}</span>
                  </div>
                  <div className="text-sub-text flex items-center justify-between text-sm">
                    <span>{t("Rooms")}</span>
                    <span>
                      {item.count} {t("rooms")}
                    </span>
                  </div>
                  <div className="text-sub-text flex items-center justify-between text-sm">
                    <span>{t("Subtotal (rate * nights * rooms)")}</span>
                    <span>
                      {item.totalSubtotal} {t("KWD")}
                    </span>
                  </div>
                  {item.totalInsurance > 0 && (
                    <div className="text-sub-text flex items-center justify-between text-sm">
                      <span>
                        {t("Total Insurance (rooms * room insurance)")}
                      </span>
                      <span>
                        {item.totalInsurance} {t("KWD")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100" />
              </div>
            ))}
          </div>
        )}

        {appliedDiscount > 0 && (
          <>
            <div className="text-sub-text flex items-center justify-between text-sm">
              <span>{t("Discount")}</span>
              <span className="font-semibold text-emerald-500">
                -{`${appliedDiscount} ${t("KWD")}`}
              </span>
            </div>
            <div className="border-t border-gray-100" />
          </>
        )}

        <div className="bg-secondary flex items-center justify-between rounded-lg px-2 py-3 text-sm">
          <span className="text-brand-text font-semibold">
            {t("Total Price")}
          </span>
          <span className="text-primary font-bold">
            {`${total} ${t("KWD")}`}
          </span>
        </div>

        {walletBalance !== undefined && walletBalance < 0 && (
          <div className="text-sub-text flex items-center justify-between text-sm">
            <span>{t("Debited wallet")}</span>
            <span className="font-semibold text-red-400">
              {`${Math.abs(walletBalance)} ${t("KWD")}`}
            </span>
          </div>
        )}
      </BookingSectionCard>

      <BookingSectionCard
        title={t("Booking details")}
        className="bg-secondary border-secondary-dark p-4"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="border-secondary-dark bg-secondary flex-1 rounded-xl border p-3">
              <p className="text-sub-text text-xs">{t("Check-in")}</p>
              <p className="text-brand-text text-sm font-semibold">
                {daysFormatDate(startDate)}
              </p>
              {entryTime && (
                <p className="text-sub-text text-xs">
                  {t("from")} {entryTime}
                </p>
              )}
            </div>
            <MdOutlineArrowRightAlt className="text-2xl" />

            <div className="border-secondary-dark bg-secondary flex-1 rounded-xl border p-3">
              <p className="text-sub-text text-xs">{t("Check-out")}</p>
              <p className="text-brand-text text-sm font-semibold">
                {daysFormatDate(endDate)}
              </p>
              {exitTime && (
                <p className="text-sub-text text-xs">
                  {t("before")} {exitTime}
                </p>
              )}
            </div>
            <div className="text-primary-dark flex items-center justify-center gap-2 sm:px-2">
              {numberOfNights > 0 && (
                <span className="bg-primary-light text-primary rounded-full px-3 py-1 text-xs font-semibold">
                  {`${numberOfNights} ${nightsLabel}`}
                </span>
              )}
            </div>
          </div>

          <div className="text-gray-text flex flex-wrap items-center gap-3 text-sm">
            {guestsLabel && (
              <span className="bg-primary-light text-primary rounded-full px-3 py-1 text-xs font-semibold">
                {`${guests} ${guestsLabel}`}
              </span>
            )}

            {totalRooms > 0 && (
              <span className="bg-primary-light text-primary rounded-full px-3 py-1 text-xs font-semibold">
                {`${totalRooms} ${t(totalRooms > 1 ? "rooms" : "room")}`}
              </span>
            )}
          </div>

          {rooms.length > 0 && (
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {rooms.map(({ unitType, count }) => {
                const roomName =
                  i18n.language === "en"
                    ? unitType.localizedData.nameEn
                    : unitType.localizedData.nameAr;

                return (
                  <div key={unitType.id} className="flex items-center gap-2">
                    <CiCircleCheck className="text-emerald-500" />
                    <span>
                      {count} {roomName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!status && (
            <div className="flex items-center justify-end">
              <Button
                variant="contained"
                className="bg-primary-light! text-primary! hover:bg-primary/20! text-xs! normal-case! shadow-none!"
                onClick={() => navigate(`/hotel/${hotel.uuid}/rooms`)}
              >
                {t("Change Booking Time")} →
              </Button>
            </div>
          )}
        </div>
      </BookingSectionCard>

      <BookingSectionCard
        title={t("Policies & notes")}
        className="border-secondary-dark p-4"
      >
        {reservationLimit !== null && (
          <div className="text-gray-text flex items-start gap-2 text-sm">
            <CiCircleCheck className="mt-0.5 text-lg text-emerald-500" />
            <span>
              {t("Reservation limit")} {reservationLimit} {t("days")}
            </span>
          </div>
        )}
        {(entryTime || exitTime) && (
          <div className="text-gray-text flex items-start gap-2 text-sm">
            <CiCircleCheck className="mt-0.5 text-lg text-emerald-500" />
            <span>
              {t("Check-in / Check-out")}
              {entryTime && ` ${t("from")} ${entryTime}`}
              {exitTime && ` ${t("before")} ${exitTime}`}
            </span>
          </div>
        )}
        <div className="text-gray-text flex items-start gap-2 text-sm">
          <MdOutlineInfo className="mt-0.5 text-lg text-amber-500" />
          <span>{t("Please contact support for special requests")}</span>
        </div>
      </BookingSectionCard>
    </div>
  );
}

export default HotelBookingSummaryPanel;
