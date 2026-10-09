import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { fromUTCToLocal } from "../../utils/dateUtils";
import { t } from "i18next";
import { HotelReservation } from "../../types/reservation/HotelResevationSchema";
import ReservationMessageSkeleton from "./ReservationMessageSkeleton";
import { statusMap } from "../../utils/statusUtils";
import { FaMapPin, FaClock } from "react-icons/fa";

interface HotelReservationMessageProps {
  reservationData?: HotelReservation;
  own?: boolean;
  isLoading?: boolean;
  timestamp?: Timestamp;
}

export default function HotelReservationMessage({
  reservationData,
  own,
  isLoading,
}: HotelReservationMessageProps) {
  const { i18n } = useTranslation();

  if (isLoading || !reservationData) {
    return (
      <div
        className={`flex w-full flex-col ${
          own ? "items-end" : "items-start"
        } mb-2`}
      >
        <ReservationMessageSkeleton />
      </div>
    );
  }

  const beginLocal = fromUTCToLocal(reservationData.begin);
  const endLocal = fromUTCToLocal(reservationData.end);
  const formattedBegin = dayjs(beginLocal)
    .locale(i18n.language)
    .format("MMMM DD, YYYY");
  const formattedEnd = dayjs(endLocal)
    .locale(i18n.language)
    .format("MMMM DD, YYYY");

  const formatTime = (value?: string) => {
    if (!value) return "";
    return dayjs(value, "hh:mm A").locale(i18n.language).format("hh:mm A");
  };

  const dateRange = `${formattedBegin} - ${formattedEnd}`;

  const invoiceStatus = reservationData.groupInvoice?.groupInvoiceStatus;
  const status =
    reservationData.status === "CONFIRMED"
      ? statusMap[invoiceStatus ?? reservationData.paymentStatus]
      : statusMap[reservationData.status];

  const hotelName =
    i18n.language === "en"
      ? reservationData.hotel.localizedData.nameEn
      : reservationData.hotel.localizedData.nameAr;

  const hotelAddress =
    i18n.language === "en"
      ? reservationData.hotel.localizedData.addressEn
      : reservationData.hotel.localizedData.addressAr;

  const entryTime = reservationData.hotel.timeDetails.entryTime;
  const exitTime = reservationData.hotel.timeDetails.exitTime;
  const hotelImage = reservationData.hotel.media?.find(
    (media) => media.type === "image"
  )?.url;

  return (
    <div
      className={`flex w-full flex-col ${
        own ? "items-end" : "items-start"
      } mb-2`}
    >
      <div
        className={`w-[80%] min-w-[330px] overflow-hidden rounded-3xl shadow-md ${
          own ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
      >
        {/* Header */}
        <div className="bg-primary px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-primary-foreground text-base font-semibold">
              {t("Reservation Details")}
            </h3>
            <span
              className="rounded-full px-2 py-1 text-sm text-white"
              style={{ backgroundColor: status?.color }}
            >
              {t(status?.value)}
            </span>
          </div>
          <div className="text-primary-foreground/80 mt-1 flex justify-between text-xs">
            <span>{reservationData.groupCode}</span>
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4 space-y-4">
            <div className="border-border border-b pb-4 last:border-b-0">
              <div className="flex gap-3">
                <div className="bg-muted flex h-18 flex-1 items-center justify-center overflow-hidden rounded">
                  {hotelImage ? (
                    <img
                      src={hotelImage}
                      alt={hotelName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm font-semibold">
                      {hotelName?.charAt(0) || "H"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold">{hotelName}</p>
                  {hotelAddress && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <FaMapPin className="h-3 w-3" />
                      <span className="max-w-[150px] truncate">
                        {hotelAddress}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {entryTime && (
                      <div className="flex items-center gap-1">
                        <FaClock className="h-3 w-3" />
                        <span>
                          {t("Entry")}: {formatTime(entryTime)}
                        </span>
                      </div>
                    )}
                    {exitTime && (
                      <div className="flex items-center gap-1">
                        <FaClock className="h-3 w-3" />
                        <span>
                          {t("Exit")}: {formatTime(exitTime)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {reservationData.groupUnitTypes?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{t("Room types")}</h4>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  {reservationData.groupUnitTypes.map((unit) => {
                    const roomName =
                      i18n.language === "en"
                        ? unit.unitType.localizedData.nameEn
                        : unit.unitType.localizedData.nameAr;

                    return (
                      <div
                        key={unit.unitType.id}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between font-medium text-gray-800">
                          <span>
                            {unit.count} x {roomName}
                          </span>
                          <span>
                            {unit.totalCost} {t("KWD")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>{t("Subtotal")}</span>
                          <span>
                            {unit.totalSubtotal} {t("KWD")}
                          </span>
                        </div>
                        {unit.totalInsurance > 0 && (
                          <div className="flex items-center justify-between text-xs">
                            <span>{t("Insurance")}</span>
                            <span>
                              {unit.totalInsurance} {t("KWD")}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {reservationData.groupInvoice && (
            <div className="bg-primary-light flex w-full flex-col gap-1 rounded-xl p-5">
              <h3 className="font-semibold">{t("Invoice Summary")}</h3>
              <div>
                {SummaryRow({
                  label: "Subtotal",
                  value: reservationData.totalSubtotal,
                })}
                {SummaryRow({
                  label: "Insurance",
                  value: reservationData.totalInsurance,
                })}
                {SummaryRow({
                  label: "Discount",
                  value: reservationData.groupInvoice.totalDiscount,
                })}
                {SummaryRow({
                  label: "Paid",
                  value: reservationData.groupInvoice.totalPaidAmount,
                })}
                {SummaryRow({
                  label: "Remaining",
                  value: reservationData.groupInvoice.totalRemainingAmount,
                })}
              </div>
              <p className="flex justify-between text-sm font-semibold">
                <span className="font-semibold">{t("Total Amount")}:</span>
                <span className="text-primary leading-relaxed font-semibold tracking-wide">
                  {reservationData.groupInvoice.totalAmount} {t("KWD")}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type SummaryRowParams = {
  label: string;
  value: number | string | null | undefined;
};

function SummaryRow({ label, value }: SummaryRowParams) {
  const numericValue = Number(value);
  if (!numericValue || numericValue <= 0) return null;
  return (
    <p className="flex justify-between text-sm font-medium">
      <span className="text-gray-500">{t(label)}:</span>
      <span className="leading-relaxed tracking-wide">
        {numericValue} {t("KWD")}
      </span>
    </p>
  );
}
