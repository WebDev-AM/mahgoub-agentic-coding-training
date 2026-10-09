import { t } from "i18next";
import { z } from "zod";
import { HotelReservation } from "./HotelResevationSchema";
import { ChaletReservation } from "./ChaletReservationSchema";
/* --------------------------------------------- */
/* --------------------------------------------- */

export type ReservationPeriod = {
  price: number;
  startPeriod: string;
  endPeriod: string;
  typePeriod: string;
  status: string;
};

export type PaymentMethod = {
  PaymentMethodEn: string;
  PaymentMethodAr: string;
  PaymentMethodId: number;
  IsDirectPayment: boolean;
  ImageUrl: string;
  ServiceCharge: string;
  TotalAmount: string;
};

export type PromoCodeUsage = {
  usageId: string;
  code: string;
  userId: string;
  orderId: string;
  usageDate: string;
  appliedDiscount: number;
  metadata: string;
  reasonForUsage: string;
  ipAddress: string;
  device: string;
  location: string;
};

export type Wallet = {
  walletId: string;
  userId: string;
  balance: number;
  currency: string;
  createdBy: string;
};

export const completePaymentSchema = z.object({
  invoiceNumber: z.string(),
  paymentMethod: z.number().min(1, t("Please select a payment method")),
  language: z.string(),
});

export type CompletePaymentType = z.infer<typeof completePaymentSchema>;

export const UpdateReservationSchema = z.object({
  reservationId: z.string().nonempty({ message: "Reservation ID is required" }),
  note: z.string(),
  begin: z.string().nonempty({ message: "Start date is required" }),
  end: z.string().nonempty({ message: "End date is required" }),
});
export type UpdateReservationType = z.infer<typeof UpdateReservationSchema>;

export type BookingReservationItem = {
  group: boolean;
  reservation: ChaletReservation | null;
  groupReservation: HotelReservation | null;
  createdAt: string;
};
