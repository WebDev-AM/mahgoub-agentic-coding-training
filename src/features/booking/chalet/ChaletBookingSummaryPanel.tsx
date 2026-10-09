import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MdLocationOn,
  MdOutlineArrowRightAlt,
  MdOutlineInfo,
} from "react-icons/md";
import { FiShield } from "react-icons/fi";
import { CiCircleCheck } from "react-icons/ci";

import { AmenityItem, getAmenities } from "../../../utils/amenitiesUtils";
import { daysFormatDate } from "../../../utils/dateUtils";
import BookingSectionCard from "../BookingSectionCard";
import { Chalet } from "../../../types/ChaletSchema";
import { Button } from "@mui/material";

export type ChaletBookingSummaryData = {
  chalet: Chalet;
  numberOfNights: number;
  subtotal: number;
  insurance: number;
  insurancePaidAtArrival: number;
  discount?: number;
  totalPaid?: number;
  status?: string;
  totalRemaining?: number;
  walletBalance?: number;
  startDate: string;
  endDate: string;
  guests?: number;
};

function ChaletBookingSummaryPanel({
  summary: {
    chalet,
    numberOfNights,
    subtotal,
    insurance,
    insurancePaidAtArrival,
    discount,
    totalPaid,
    totalRemaining = 0,
    startDate,
    endDate,
    guests,
    status,
    walletBalance,
  },
}: {
  summary: ChaletBookingSummaryData;
}) {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const amenities = getAmenities(chalet);

  const unitName =
    i18n.language === "en"
      ? chalet.localizedData.nameEn
      : chalet.localizedData.nameAr;

  const unitDescription =
    i18n.language === "en"
      ? chalet.localizedData.descriptionEn
      : chalet.localizedData.descriptionAr;

  const unitAddress =
    i18n.language === "en"
      ? chalet.localizedData.addressEn
      : chalet.localizedData.addressAr;

  const nightlyRate = numberOfNights
    ? (subtotal / numberOfNights).toFixed(2)
    : chalet.pricingDetails?.dailyPrice || 0;

  const searchParamDiscount = Number(searchParams.get("discount") || 0);

  const appliedDiscount = discount ?? searchParamDiscount;
  const total = Math.max(0, subtotal + insurance - appliedDiscount);

  const nightsLabel = t(numberOfNights > 1 ? "nights" : "night");
  const guestsLabel =
    typeof guests === "number" && guests > 0
      ? t(guests > 1 ? "guests" : "guest")
      : null;

  const amenityList = amenities.filter(
    ({ count, condition }) =>
      (count !== undefined && count > 0) || condition === true
  );

  const priorityLabels = [t("Pools"), t("Beds"), t("Bathrooms"), t("Kitchens")];

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

  const entryTime = chalet.timeDetails.entryTime;
  const exitTime = chalet.timeDetails.exitTime;
  const reservationLimit = chalet.pricingDetails.reservationLimitInDays;

  const isGrayscale = status === "CANCELLED" || status === "REPLACED";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="border-secondary-dark rounded-3xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="h-60 w-full overflow-hidden rounded-2xl md:h-72">
            <motion.img
              className={`${isGrayscale ? "grayscale" : ""} h-full w-full object-cover`}
              src={chalet.media?.[0]?.url}
              alt={unitName}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <h3 className="text-heading text-xl font-bold">{unitName}</h3>
              {unitAddress && (
                <div className="text-sub-text mt-1 flex items-center gap-1 text-sm">
                  <MdLocationOn className="text-sub-text text-base" />
                  <span>{unitAddress}</span>
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

            <p className="text-gray-text text-sm">{unitDescription}</p>

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

      <BookingSectionCard
        title={t("Price breakdown")}
        className="border-secondary-dark p-4"
      >
        {chalet.reservationType === "DAILY" ? (
          <>
            <div className="text-sub-text flex items-center justify-between text-sm">
              <span>{t("Price (per night)")}</span>
              <span className="text-brand-text font-semibold">
                {`${nightlyRate} ${t("KWD")}`}
              </span>
            </div>

            <div className="border-t border-gray-100" />

            <div className="text-sub-text flex items-center justify-between text-sm">
              <span>{`${numberOfNights} ${nightsLabel}`}</span>
              <span className="text-brand-text font-semibold">
                {`${subtotal} ${t("KWD")}`}
              </span>
            </div>
          </>
        ) : (
          <div className="text-sub-text flex items-center justify-between text-sm">
            <span>{t("Subtotal")}</span>
            <span className="text-brand-text font-semibold">
              {`${subtotal} ${t("KWD")}`}
            </span>
          </div>
        )}
        <div className="border-t border-gray-100" />

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

        {insurance > 0 && (
          <div className="text-sub-text flex items-center justify-between text-sm">
            <span>{t("Refundable Deposit")}</span>
            <span className="text-brand-text font-semibold">
              {`${insurance} ${t("KWD")}`}
            </span>
          </div>
        )}

        <div className="border-t border-gray-200" />

        {totalPaid && (
          <>
            <div className="text-sub-text flex items-center justify-between text-sm">
              <span>{t("Total paid")}</span>
              <span className="text-brand-text font-semibold">
                {`${totalPaid} ${t("KWD")}`}
              </span>
            </div>

            <div className="border-t border-gray-100" />
          </>
        )}

        {totalRemaining > 0 && (
          <>
            <div className="text-sub-text flex items-center justify-between text-sm">
              <span>{t("Remaining")}</span>
              <span className="font-semibold text-red-500">
                {`${totalRemaining} ${t("KWD")}`}
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

        {insurancePaidAtArrival > 0 && (
          <div className="flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <FiShield className="text-2xl text-amber-500" />
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <h3 className="text-brand-text text-lg font-semibold">
                {t("Refundable Deposit")}
              </h3>

              <span className="text-brand-text text-xl font-bold">
                {insurancePaidAtArrival} {t("KWD")}
              </span>

              <span className="text-sm text-amber-700">
                {t("Payment Method")}: {t("Pay at Check-in")}
              </span>

              <p className="max-w-3xl text-sm text-amber-600">
                {t(
                  "This amount will be collected upon check-in and is fully refundable after your stay, subject to our terms and conditions."
                )}
              </p>
            </div>
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
                <span className="bg-primary-light text-primary-dark rounded-full px-3 py-1 text-xs font-semibold">
                  {`${numberOfNights} ${nightsLabel}`}
                </span>
              )}
            </div>
          </div>

          <div className="text-gray-text flex flex-wrap items-center gap-3 text-sm">
            {guestsLabel && (
              <span className="bg-primary-light text-primary-dark rounded-full px-3 py-1 text-xs font-semibold">
                {`${guests} ${guestsLabel}`}
              </span>
            )}
          </div>
          {!status && (
            <div className="flex items-center justify-end">
              <Button
                variant="contained"
                className="bg-primary-light! text-primary! hover:bg-primary/20! text-xs! normal-case! shadow-none!"
                onClick={() => navigate(`/chalet/${chalet.id}`)}
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

export default ChaletBookingSummaryPanel;
