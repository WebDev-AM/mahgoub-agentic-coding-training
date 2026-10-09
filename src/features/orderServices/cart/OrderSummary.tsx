import { Divider } from "@mui/material";
import { t } from "i18next";
import { ReactNode } from "react";
import { useCart } from "./useCart";
import PageSpinner from "../../../ui/PageSpinner";

function OrderSummary({
  children,
  rows,
}: {
  children: ReactNode;
  rows?: { label: string; value: number }[];
}) {
  const { cart, isLoading } = useCart();
  if (isLoading) return <PageSpinner />;

  const cartArray = cart ? Object.values(cart) : [];
  const subtotal = cartArray.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-primary-light sticky top-10 flex w-80 flex-col gap-5 rounded-md px-5 py-8 shadow-md">
      <h3 className="text-xl font-semibold">{t("Order Summary")}</h3>
      <div>
        <div className="flex justify-between">
          <span className="font-light text-gray-500">{t("Subtotal")}:</span>
          <span className="leading-relaxed font-semibold tracking-wide">
            {subtotal.toFixed(3)} {t("KWD")}
          </span>
        </div>
        {rows
          ?.filter((row) => row.value)
          .map((row) => (
            <div className="flex justify-between" key={row.label}>
              <span className="font-light text-gray-500">{t(row.label)}:</span>
              <span className="leading-relaxed font-semibold tracking-wide">
                {row.value} {t("KWD")}
              </span>
            </div>
          ))}
      </div>
      <Divider />
      <div className="flex justify-between text-lg font-semibold">
        <span className="font-semibold">{t("Total Price")}:</span>
        <span className="text-primary leading-relaxed font-semibold tracking-wide">
          {(
            subtotal + (rows?.reduce((acc, row) => acc + row.value, 0) || 0)
          ).toFixed(3)}{" "}
          {t("KWD")}
        </span>
      </div>
      {children}
    </div>
  );
}

export default OrderSummary;
