import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { PayOrderSchema, PayOrderSchemaType } from "../../../types/OrderSchema";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useInitiatePayment } from "../../booking/useInitiatePayment";
import { t } from "i18next";
import OrderSummary from "../cart/OrderSummary";
import { useMe } from "../../authentication/useMe";
import PageSpinner from "../../../ui/PageSpinner";
import { Navigate, useParams } from "react-router-dom";
import usePayOrder from "./usePayOrder";
import { useOrder } from "./useOrder";

function OrderPaymentStep() {
  const { i18n } = useTranslation();
  const { paymentMethods, isLoading: isIinitiating } = useInitiatePayment(99);
  const { payOrder, isPaying } = usePayOrder();
  const { user, isLoading } = useMe();
  const { passedValue } = useParams();
  const { order, isLoading: isOrderLoading } = useOrder(passedValue!);

  const { control, handleSubmit, watch } = useForm<PayOrderSchemaType>({
    resolver: zodResolver(PayOrderSchema),
    defaultValues: {
      language: i18n.language,
      orderNumber: passedValue!,
    },
    mode: "onChange",
  });
  const onSubmit = (data: PayOrderSchemaType) => {
    payOrder(data);
  };

  if (isLoading || isIinitiating || isOrderLoading) return <PageSpinner />;
  if (!user || !passedValue) return <Navigate to={"/order-checkout/0"} />;
  if (order?.orderStatus === "PAID") return <Navigate to={"/"} />;
  const paymentMethod = watch("paymentMethod");

  return (
    <form
      className="flex flex-1 flex-col items-center justify-center gap-20 md:flex-row md:items-start"
      onSubmit={handleSubmit(onSubmit)}
    >
      <motion.div
        className="flex-1 p-2 text-center md:text-start"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <h2 className="text-primary mb-4 text-xl font-bold">
          {t("Select a Payment Method")}
        </h2>
        <Controller
          name="paymentMethod"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {paymentMethods?.map((method) => (
                <div
                  key={method.PaymentMethodId}
                  onClick={() => {
                    field.onChange(method.PaymentMethodId);
                  }}
                  className={`flex h-28 w-60 cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 shadow-sm transition duration-200 ${
                    field.value === method.PaymentMethodId
                      ? "border-primary shadow-md"
                      : "hover:border-primary border-secondary-dark hover:shadow-md"
                  }`}
                >
                  <img
                    src={method.ImageUrl}
                    alt={method.PaymentMethodEn}
                    className="mb-2 h-10 w-16 object-contain"
                  />
                  <span className="text-center text-sm font-medium">
                    {i18n.language === "ar"
                      ? method.PaymentMethodAr
                      : method.PaymentMethodEn}
                  </span>
                </div>
              ))}
            </div>
          )}
        />
      </motion.div>

      <OrderSummary
        rows={[
          { label: "Delivery Fee", value: order!.totalDeliveryFee },
          { label: "Tax Amount", value: order!.taxAmount },
          { label: "Vat Amount", value: order!.vatAmount },
          { label: "Zakat Amount", value: order!.zakatAmount },
        ]}
      >
        <button
          type="submit"
          disabled={isPaying || paymentMethod === undefined}
          className="bg-primary hover:bg-primary-shade flex h-12 w-full cursor-pointer items-center justify-center text-lg font-semibold text-white transition hover:shadow-2xl disabled:bg-gray-400"
        >
          {t("Pay")}
        </button>
      </OrderSummary>
    </form>
  );
}

export default OrderPaymentStep;
