import { useEffect, useState } from "react";
import { Button, Switch } from "@mui/material";
import { t } from "i18next";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MdOutlineEventAvailable, MdOutlineWarningAmber } from "react-icons/md";

import { useHotelReservation } from "../../reservation/hotel/useHotelReservation";
import { useCreateHotelPaymentUrl } from "./useCreateHotelPaymentUrl";
import { useInitiatePayment } from "../useInitiatePayment";
import { useWallet } from "../../reservation/useWallet";

import PageSpinner from "../../../ui/PageSpinner";
import HotelBookingSummaryPanel, {
  HotelBookingSummaryData,
} from "./HotelBookingSummaryPanel";

import { useTranslation } from "react-i18next";
import {
  createHotelPaymentSchema,
  CreateHotelPaymentType,
} from "../../../types/reservation/HotelResevationSchema";
import dayjs from "dayjs";

function HotelBookingPaymentConfirmation() {
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  const usageId = searchParams.get("usageId") || undefined;
  const discountValue = Number(searchParams.get("discount") || 0);

  const { isLoading, error, reservation } = useHotelReservation(
    reservationId || undefined
  );
  const { createPaymentUrl } = useCreateHotelPaymentUrl();
  const { isLoading: isWalletLoading, wallet } = useWallet();

  const discount = Number.isFinite(discountValue) ? discountValue : 0;
  const isFreeCancellation = reservation?.paymentStatus === "FREE_CANCELLATION";
  const walletDebt =
    wallet?.balance !== undefined && wallet.balance < 0
      ? Math.abs(wallet.balance)
      : 0;
  const hasWalletDebt = walletDebt > 0;
  const requiresPayment = !isFreeCancellation || hasWalletDebt;
  const paymentAmount = isFreeCancellation
    ? walletDebt
    : Math.max(0, (reservation?.totalCost || 0) - discount);

  const { paymentMethods, isLoading: isInitiating } = useInitiatePayment(
    requiresPayment ? paymentAmount : undefined
  );

  const [agreed, setAgreed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateHotelPaymentType>({
    resolver: zodResolver(createHotelPaymentSchema),
    defaultValues: {
      isWalletPayment: false,
      usageId,
      paymentMethod: requiresPayment ? undefined : 0,
      groupReservationId: reservation?.uuid || reservationId || "",
      language: i18n.language,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!reservation?.uuid) return;

    reset({
      isWalletPayment: false,
      usageId,
      paymentMethod: requiresPayment ? undefined : 0,
      groupReservationId: reservation.uuid,
      language: i18n.language,
    });
  }, [reservation?.uuid, usageId, i18n.language, requiresPayment, reset]);

  if (isLoading || isInitiating || isWalletLoading) return <PageSpinner />;
  if (error || !reservation || !reservation.hotel) return <Navigate to="/" />;

  const numberOfNights = Math.max(
    0,
    dayjs(reservation.end).diff(dayjs(reservation.begin), "day")
  );

  const summary: HotelBookingSummaryData = {
    hotel: reservation.hotel,
    rooms: reservation.groupUnitTypes,
    numberOfNights,
    subtotal: reservation.totalSubtotal || 0,
    insurance: reservation.totalInsurance || 0,
    discount,
    walletBalance: wallet?.balance,
    startDate: reservation.begin,
    endDate: reservation.end,
  };

  const onSubmit = (data: CreateHotelPaymentType) => {
    setIsCreating(true);
    createPaymentUrl({
      ...data,
      paymentMethod: requiresPayment ? data.paymentMethod : 0,
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
        <HotelBookingSummaryPanel summary={summary} />

        <form
          className="sticky top-5 flex w-full flex-col gap-6 lg:w-[420px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          {isFreeCancellation && (
            <motion.div
              className="border-primary/20 from-primary-light to-secondary flex flex-col gap-4 rounded-2xl border bg-gradient-to-br via-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                <MdOutlineEventAvailable className="text-2xl" />
              </div>
              <div>
                <h3 className="text-brand-text text-lg font-semibold">
                  {t("Free cancellation reservation")}
                </h3>
                <p className="text-sub-text mt-2 text-sm leading-6">
                  {t(
                    "This reservation does not require any payment. Confirm to create your reservation."
                  )}
                </p>
              </div>
            </motion.div>
          )}

          {requiresPayment && (
            <motion.div
              className="border-secondary-dark rounded-2xl border bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-brand-text text-base font-semibold">
                {t("Choose payment method")}
              </h3>

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

              {errors.paymentMethod && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </motion.div>
          )}

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
          </div>

          <Button
            className="!bg-primary hover:!bg-primary-shade h-11 disabled:!bg-gray-400"
            variant="contained"
            type="submit"
            disabled={
              !agreed ||
              (requiresPayment && !paymentMethods?.length) ||
              isCreating
            }
          >
            {requiresPayment ? t("Confirm & Pay") : t("Confirm")}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default HotelBookingPaymentConfirmation;
