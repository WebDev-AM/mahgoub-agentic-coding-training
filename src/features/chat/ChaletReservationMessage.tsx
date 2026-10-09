import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { fromUTCToLocal } from "../../utils/dateUtils";
import { t } from "i18next";
import { ChaletReservation } from "../../types/reservation/ChaletReservationSchema";
import ReservationChaletMessage from "./ReservationChaletMessage";
import ReservationMessageSkeleton from "./ReservationMessageSkeleton";
import { statusMap } from "../../utils/statusUtils";

interface ChaletReservationMessageProps {
  reservationData?: ChaletReservation;
  own?: boolean;
  isLoading?: boolean;
  timestamp?: Timestamp;
}

export default function ChaletReservationMessage({
  reservationData,
  own,
  isLoading,
}: ChaletReservationMessageProps) {
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

  // Format date range
  const beginLocal = fromUTCToLocal(reservationData.begin);
  const endLocal = fromUTCToLocal(reservationData.end);
  const formattedBegin = dayjs(beginLocal)
    .locale(i18n.language)
    .format("MMMM DD, YYYY");
  const formattedEnd = dayjs(endLocal)
    .locale(i18n.language)
    .format("MMMM DD, YYYY");
  const dateRange = `${formattedBegin} - ${formattedEnd}`;

  const status =
    reservationData.status === "CONFIRMED"
      ? statusMap[reservationData.paymentStatus]
      : statusMap[reservationData.status];

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
              className={`rounded-full px-2 py-1 text-sm text-white`}
              style={{ backgroundColor: status?.color }}
            >
              {t(status?.value)}
            </span>
          </div>
          <div className="text-primary-foreground/80 mt-1 flex justify-between text-xs">
            <span>{reservationData.reservationCode}</span>
            <span>{dateRange}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-4 space-y-4">
            {/* Chalet details (single item for now) */}
            {reservationData.unit && (
              <ReservationChaletMessage chalet={reservationData.unit} />
            )}
          </div>

          {/* Invoice Summary */}
          {reservationData.invoice && (
            <div className="bg-primary-light flex w-full flex-col gap-1 rounded-xl p-5">
              <h3 className="font-semibold">{t("Invoice Summary")}</h3>
              <div>
                {SummaryRow({
                  label: "Subtotal",
                  value: reservationData.invoice.subtotal,
                })}
                {SummaryRow({
                  label: "Insurance",
                  value: reservationData.invoice.insuranceAmount,
                })}
                {SummaryRow({
                  label: "Tax",
                  value: reservationData.invoice.taxAmount,
                })}
                {SummaryRow({
                  label: "Discount",
                  value: reservationData.invoice.totalDiscount,
                })}
                {SummaryRow({
                  label: "Paid",
                  value: reservationData.invoice.totalPaidAmount,
                })}
                {SummaryRow({
                  label: "Remaining",
                  value: reservationData.invoice.totalRemainingAmount,
                })}
              </div>
              <p className="flex justify-between text-sm font-semibold">
                <span className="font-semibold">{t("Total Amount")}:</span>
                <span className="text-primary leading-relaxed font-semibold tracking-wide">
                  {reservationData.invoice.totalAmount -
                    reservationData.invoice.totalDiscount}{" "}
                  {t("KWD")}
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
