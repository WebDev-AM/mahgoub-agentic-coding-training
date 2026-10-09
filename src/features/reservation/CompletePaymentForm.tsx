import { zodResolver } from "@hookform/resolvers/zod";
import { useInitiatePayment } from "../booking/useInitiatePayment";
import { useCompleteChaletPayment } from "../booking/chalet/useCompleteChaletPayment";
import {
  completePaymentSchema,
  CompletePaymentType,
} from "../../types/reservation/ReservationsSchema";
import { ChaletInvoice } from "../../types/reservation/ChaletReservationSchema";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, CircularProgress } from "@mui/material";
import { t } from "i18next";

type CompletePaymentFormProps = { invoice?: ChaletInvoice };

function CompletePaymentForm({ invoice }: CompletePaymentFormProps) {
  const { completePayment, isCreating } = useCompleteChaletPayment();
  const { i18n } = useTranslation();
  const { paymentMethods, isLoading } = useInitiatePayment(
    invoice?.totalRemainingAmount
  );
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<CompletePaymentType>({
    resolver: zodResolver(completePaymentSchema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber,
      paymentMethod: undefined,
      language: i18n.language || "EN",
    },
    mode: "onChange",
  });

  const onSubmit = (data: CompletePaymentType) => {
    completePayment(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-28 w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <Controller
        name="paymentMethod"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {paymentMethods?.map((method) => (
              <div
                key={method.PaymentMethodId}
                onClick={() => field.onChange(method.PaymentMethodId)}
                className={`flex h-28 w-42 cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-4 shadow-sm transition duration-200 ${
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
                <span className="text-center text-xs font-medium">
                  {`${t("Service charge")} ${method.ServiceCharge}`}
                </span>
              </div>
            ))}
          </div>
        )}
      />
      <Button
        type="submit"
        variant="contained"
        className="!bg-primary hover:!bg-primary-shade h-10 w-full disabled:!bg-gray-400"
        disabled={!isValid || isCreating}
      >
        {t("Complete Payment")}
      </Button>
    </form>
  );
}

export default CompletePaymentForm;
