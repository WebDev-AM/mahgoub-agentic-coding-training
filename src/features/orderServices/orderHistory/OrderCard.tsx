import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { OrderDetails } from "../../../types/OrderSchema";
import { ServiceOrderBlock } from "./ServiceOrderBlock";
import { Button } from "@mui/material";
import { useAddItemsToCart } from "../cart/useAddItemsToCart";
import dayjs from "dayjs";
import { statusMap } from "../../../utils/statusUtils";
import { IoCalendarOutline } from "react-icons/io5";
import { fromUTCToLocal } from "../../../utils/dateUtils";
import OngoingOrderStatusStepper from "./OngoingOrderStatusStepper";

interface OrderCardProps {
  order: OrderDetails;
  completedOrder?: boolean;
  header?: boolean;
}

export default function OrderCard({
  order,
  completedOrder = false,
  header = true,
}: OrderCardProps) {
  const { i18n } = useTranslation();
  const { addItemsToCart, isAdding } = useAddItemsToCart();

  const handleBuyAgain = () => {
    const itemsToAdd = order.serviceOrderDTOS.flatMap((serviceOrder) =>
      serviceOrder.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    );

    addItemsToCart(itemsToAdd);
  };

  const status = statusMap[order.orderStatus];
  return (
    <div className="rounded-xl py-4">
      {/* Header */}
      {header && (
        <div className="mb-4 flex flex-col items-center justify-between gap-4 lg:flex-row lg:items-start">
          {/* <span className="text-xl font-medium">{}</span> */}

          <div className="flex flex-col items-center gap-6 lg:items-start">
            <div className="flex items-center gap-2">
              <h3 className="h3">
                {t("Order Number")}: {order.orderNumber}
              </h3>
              {completedOrder && (
                <span
                  className={`rounded-full px-2 py-1 text-sm text-white`}
                  style={{ backgroundColor: status?.color }}
                >
                  {t(status?.value)}
                </span>
              )}
            </div>
            <p className="flex items-center gap-2 text-lg">
              <IoCalendarOutline />
              {dayjs(fromUTCToLocal(order.createdAt))
                .locale(i18n.language === "ar" ? "ar" : "en")
                .format("MMMM DD, YYYY hh:mm A")}
            </p>
            {!completedOrder && (
              <OngoingOrderStatusStepper orderStatus={order.orderStatus} />
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="contained"
                className="brand-button min-w-60!"
                sx={{ textTransform: "none" }}
                disabled={isAdding}
                onClick={handleBuyAgain}
              >
                {t("Order Again")}
              </Button>
            </div>
          </div>

          <div className="bg-primary-light flex w-95 max-w-full flex-col gap-5 rounded-xl p-5">
            <h3 className="h3">{t("Order Summary")}</h3>
            <div>
              <p className="flex justify-between text-lg font-medium">
                <span className="text-gray-500">{t("Subtotal")}:</span>
                <span className="leading-relaxed tracking-wide">
                  {order.totalSubtotal} {t("KWD")}
                </span>
              </p>
              {summaryRow({
                label: "Delivery fees",
                value: order.totalDeliveryFee,
              })}
              {summaryRow({
                label: "Tax",
                value: order.taxAmount,
              })}
              {summaryRow({
                label: "Vat Amount",
                value: order.vatAmount,
              })}
              {summaryRow({
                label: "Zakat Amount",
                value: order.zakatAmount,
              })}
            </div>
            <p className="flex justify-between text-lg font-semibold">
              <span className="font-semibold">{t("Total Price")}:</span>
              <span className="text-primary leading-relaxed font-semibold tracking-wide">
                {order.totalAmount} {t("KWD")}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Services */}
      <div className="flex flex-col gap-6">
        {order.serviceOrderDTOS.map((serviceOrder) => (
          <ServiceOrderBlock
            key={serviceOrder.serviceOrderId}
            serviceOrderStatus={!completedOrder}
            serviceOrder={serviceOrder}
          />
        ))}
      </div>
    </div>
  );
}

type SummaryRowParams = {
  label: string;
  value: number | string | null | undefined;
};

function summaryRow({ label, value }: SummaryRowParams) {
  const numericValue = Number(value);

  if (!numericValue || numericValue <= 0) return null;

  return (
    <p className="flex justify-between text-lg font-medium">
      <span className="text-gray-500">{t(label)}:</span>
      <span className="leading-relaxed tracking-wide">
        {numericValue} {t("KWD")}
      </span>
    </p>
  );
}
