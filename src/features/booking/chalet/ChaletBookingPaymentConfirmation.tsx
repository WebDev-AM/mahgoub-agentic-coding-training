import { useEffect, useState } from "react";
import { Button, Switch, TextField } from "@mui/material";
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineWarningAmber } from "react-icons/md";

import { useChaletReservation } from "../../reservation/chalet/useChaletReservation";
import { useCreateChaletPaymentUrl } from "./useCreateChaletPaymentUrl";
import { useInitiatePayment } from "../useInitiatePayment";
import { useWallet } from "../../reservation/useWallet";

import PageSpinner from "../../../ui/PageSpinner";
import ChaletBookingSummaryPanel, {
  ChaletBookingSummaryData,
} from "./ChaletBookingSummaryPanel";

import { useTranslation } from "react-i18next";
import {
  createChaletPaymentSchema,
  CreateChaletPaymentType,
} from "../../../types/reservation/ChaletReservationSchema";

function ChaletBookingPaymentConfirmation() {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  const usageId = searchParams.get("usageId") || undefined;
  const discountValue = Number(searchParams.get("discount") || 0);

  const { isLoading, error, reservation } = useChaletReservation(
    reservationId || undefined
  );
  const { createPaymentUrl } = useCreateChaletPaymentUrl();
  const { paymentMethods, isLoading: isIinitiating } = useInitiatePayment(
    reservation?.price
  );
  const { isLoading: isWalletLoading, wallet } = useWallet();
  const hasWalletDebt = wallet?.balance !== undefined && wallet.balance < 0;

  const [agreed, setAgreed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const MIN_PAYMENT = reservation?.prepaidMinimumAmount || 0;
  const MAX_PAYMENT = reservation?.price || 0;
  const discount = Number.isFinite(discountValue) ? discountValue : 0;

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateChaletPaymentType>({
    resolver: zodResolver(
      createChaletPaymentSchema(MIN_PAYMENT, MAX_PAYMENT - (discount || 0))
    ),
    defaultValues: {
      isWalletPayment: false,
      isFullPayment: true,
      amount: null,
      usageId,
      paymentMethod: undefined,
      reservationId: reservation?.uuid || reservationId || "",
      language: i18n.language,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!reservation?.uuid) return;

    reset({
      isWalletPayment: false,
      isFullPayment: true,
      amount: null,
      usageId,
      paymentMethod: undefined,
      reservationId: reservation.uuid,
      language: i18n.language,
    });
  }, [reservation?.uuid, usageId, i18n.language, reset]);

  if (isLoading || isIinitiating || isWalletLoading) return <PageSpinner />;
  if (error || !reservation || !reservation.unit) return <Navigate to="/" />;

  const summary: ChaletBookingSummaryData = {
    chalet: reservation.unit,
    numberOfNights: reservation.numberOfNights || 0,
    subtotal: reservation.subtotal || 0,
    insurance: reservation.insurance || 0,
    insurancePaidAtArrival: reservation.insurancePaidAtArrival || 0,
    discount,
    walletBalance: wallet?.balance,
    startDate: reservation.begin,
    endDate: reservation.end,
  };

  const fullPaymentValue = watch("isFullPayment");

  const onSubmit = (data: CreateChaletPaymentType) => {
    setIsCreating(true);
    createPaymentUrl({
      ...data,
      isWalletPayment: hasWalletDebt ? false : data.isWalletPayment,
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="text-center">
        <h2 className="text-heading text-xl font-bold">
          {t("Payment Confirmation")}
        </h2>
        <p className="text-sub-text text-sm">
          {t("Please fill up the blank fields below")}
        </p>
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start">
        <ChaletBookingSummaryPanel summary={summary} />

        <form
          className="sticky top-5 flex w-full flex-col gap-6 lg:w-[420px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <motion.div
            className="border-secondary-dark rounded-2xl border bg-white p-5 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-brand-text text-base font-semibold">
              {t("Choose payment method")}
            </h3>

            {MAX_PAYMENT - discount > MIN_PAYMENT && (
              <div className="border-secondary-dark mt-4 flex h-12 w-full overflow-hidden rounded-xl border">
                <Controller
                  name="isFullPayment"
                  control={control}
                  render={({ field }) => (
                    <>
                      <button
                        type="button"
                        className={`flex-1 cursor-pointer transition-all ${
                          field.value && "bg-primary font-bold text-white"
                        }`}
                        onClick={() => field.onChange(true)}
                      >
                        {t("Full Payment")}
                      </button>
                      <button
                        type="button"
                        className={`flex-1 cursor-pointer transition-all ${
                          !field.value && "bg-primary font-bold text-white"
                        }`}
                        onClick={() => field.onChange(false)}
                      >
                        {t("Partial Payment")}
                      </button>
                    </>
                  )}
                />
              </div>
            )}

            {!fullPaymentValue && (
              <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
                <span className="font-bold">{t("Note")}:</span>{" "}
                {`${t("The minimum payment required to proceed with the booking is")} ${MIN_PAYMENT} ${t("KWD")}. ${t("The last date for the full payment is")} ${reservation.unit!.pricingDetails.advanceCompletePaymentDays} ${t("days before the reservation date")}`}
              </div>
            )}

            <Controller
              name="paymentMethod"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                  {paymentMethods?.map((method) => (
                    <div
                      key={method.PaymentMethodId}
                      onClick={() => {
                        field.onChange(method.PaymentMethodId);
                      }}
                      className={`flex h-24 w-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 bg-white p-3 shadow-sm transition duration-200 ${
                        field.value === method.PaymentMethodId
                          ? "border-primary shadow-md"
                          : "border-secondary-dark hover:border-primary hover:shadow-md"
                      }`}
                    >
                      <img
                        src={method.ImageUrl}
                        alt={method.PaymentMethodEn}
                        className="h-8 w-14 object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            />

            {hasWalletDebt ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <MdOutlineWarningAmber className="shrink-0 text-xl text-amber-600" />
                <div className="text-sm text-amber-800">
                  <p>{t("You will need to pay the wallet debt")}</p>
                  <p className="font-semibold">
                    {Math.abs(wallet?.balance ?? 0)} {t("KWD")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sub-text text-sm">
                  {t("Wallet Payment")}{" "}
                  {`(${t("balance")}: ${wallet?.balance} ${t("KWD")})`}
                </p>
                <Controller
                  name="isWalletPayment"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      color="primary"
                      size="small"
                      onChange={() => field.onChange(!field.value)}
                    />
                  )}
                />
              </div>
            )}

            {!fullPaymentValue && (
              <div className="mt-3">
                <TextField
                  label={t("Partial Payment")}
                  defaultValue={undefined}
                  variant="outlined"
                  size="small"
                  className="w-full"
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                  {...register("amount", { valueAsNumber: true })}
                />
              </div>
            )}
          </motion.div>

          <div className="border-secondary-dark rounded-2xl border bg-white p-5 shadow-sm">
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
                type="submit"
                className="!bg-primary hover:!bg-primary-shade h-10 flex-1 disabled:!bg-gray-400"
                variant="contained"
                disabled={!isValid || isCreating || !agreed}
              >
                {t("Confirm Booking")}
              </Button>
              <Button
                className="h-10 flex-1"
                variant="outlined"
                onClick={() => window.history.back()}
              >
                {t("Cancel")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChaletBookingPaymentConfirmation;
