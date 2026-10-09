import { OrderDetails } from "../../types/OrderSchema";
import { Timestamp } from "firebase/firestore";

interface OrderMessageProps {
  orderData?: OrderDetails;
  own?: boolean;
  isLoading?: boolean;
  timestamp?: Timestamp;
}
import OrderMessageSkeleton from "./OrderMessageSkeleton";
import { t } from "i18next";
import ServiceOrderMessage from "./ServiceOrderMessage";
import dayjs from "dayjs";
import { fromUTCToLocal } from "../../utils/dateUtils";
import { useTranslation } from "react-i18next";

export default function OrderMessage({
  orderData,
  own,
  isLoading,
}: OrderMessageProps) {
  const { i18n } = useTranslation();
  if (isLoading || !orderData) {
    return (
      <div
        className={`flex w-full flex-col ${
          own ? "items-end" : "items-start"
        } mb-2`}
      >
        <OrderMessageSkeleton />
      </div>
    );
  }

  const formattedDate = dayjs(fromUTCToLocal(orderData.createdAt))
    .locale(i18n.language)
    .format("MMMM DD, YYYY | hh:mm A");

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
          <h3 className="text-primary-foreground text-base font-semibold">
            {t("Order Details")}
          </h3>
          <div className="text-primary-foreground/80 mt-1 flex justify-between text-xs">
            <span>{orderData.orderNumber}</span>
            {formattedDate && <span>{formattedDate}</span>}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4 space-y-4">
            {orderData.serviceOrderDTOS?.map((serviceOrder) => (
              <ServiceOrderMessage
                key={serviceOrder.serviceOrderId}
                serviceOrder={serviceOrder}
              />
            ))}
          </div>

          <div className="bg-primary-light flex w-full flex-col gap-1 rounded-xl p-5">
            <h3 className="font-semibold">{t("Order Summary")}</h3>
            <div>
              <p className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">{t("Subtotal")}:</span>
                <span className="leading-relaxed tracking-wide">
                  {orderData.totalSubtotal} {t("KWD")}
                </span>
              </p>
              {SummaryRow({
                label: "Delivery fees",
                value: orderData.totalDeliveryFee,
              })}
              {SummaryRow({
                label: "Tax",
                value: orderData.taxAmount,
              })}
              {SummaryRow({
                label: "Vat Amount",
                value: orderData.vatAmount,
              })}
              {SummaryRow({
                label: "Zakat Amount",
                value: orderData.zakatAmount,
              })}
            </div>
            <p className="flex justify-between text-sm font-semibold">
              <span className="font-semibold">{t("Total Price")}:</span>
              <span className="text-primary leading-relaxed font-semibold tracking-wide">
                {orderData.totalAmount} {t("KWD")}
              </span>
            </p>
          </div>
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
