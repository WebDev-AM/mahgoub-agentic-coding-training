import { t } from "i18next";
import { z } from "zod";
import { Chalet } from "../ChaletSchema";
import { Rating } from "./RatingSchema";

export interface ChaletInvoice {
  invoiceNumber: string;
  orderId: string;
  userId: string;
  promocodeId: string;
  insuranceAmount: number;
  insurancePaidAtArrival: number;
  totalBeforeTax: number;
  taxAmount: number;
  totalAmount: number;
  totalDiscount: number;
  subtotal: number;

  totalPaidAmount: number;
  totalRemainingAmount: number;
  overpaymentAmount: number;
  lateFee: number;
  cancelledFee: number;
  updatedFee: number;
  currency: string;
  exchangeRate: number;
  totalInLocalCurrency: number;
  dueDate: string;
  invoiceStatus: string;
  createdAt: string;
  oldInvoiceNumber?: string;
  updatedAt: string;
  oldInvoice?: ChaletInvoice;
  payments?: Payment[];
  reservation: ChaletReservation;
  user?: ReservationUser;
}

export interface ChaletReservation {
  uuid: string;
  entityId: string;
  reservationCode: string;
  entityType: string;
  guestId: string;
  price: number;
  numberOfNights: number;
  paymentId: string;
  paymentStatus: string;
  commission: number;
  note: string;
  prepaidMinimumAmount: number;
  subtotal: number;
  status: string;
  begin: string; // ISO 8601 format
  end: string; // ISO 8601 format
  insurance: number;
  insurancePaidAtArrival: number;
  newReservationId: string;
  oldReservationId: string;
  unit?: Chalet;
  rating?: Rating;
  user?: ReservationUser;
  promoter?: ReservationUser;
  invoice: ChaletInvoice;
}

export interface ReservationUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
}

export interface Payment {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  paymentStatus: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateChaletReservationType = {
  chaletId: string;
  numberOfGuests?: number;
  note?: string;
  begin: string; // ISO
  end: string; // ISO
  promoterId?: string;
  source?: "OWNER_SHARE";
};

export const createChaletPaymentSchema = (
  MIN_PAYMENT?: number,
  MAX_PAYMENT?: number
) =>
  z
    .object({
      isFullPayment: z.boolean(),
      isWalletPayment: z.boolean(),
      amount: z
        .number({
          invalid_type_error: t("Amount is required and must be a number"),
        })
        .optional()
        .nullable(),
      usageId: z.string().optional(),
      reservationId: z.string(),
      paymentMethod: z.number({
        required_error: t("Please select a payment method"),
      }),
      language: z.string(),
    })
    .superRefine((data, ctx) => {
      if (!data.isFullPayment) {
        if (typeof data.amount !== "number" || isNaN(data.amount)) {
          ctx.addIssue({
            path: ["amount"],
            code: z.ZodIssueCode.custom,
            message: t("Amount is required and must be a number"),
          });
        } else {
          if (MIN_PAYMENT !== undefined && data.amount < MIN_PAYMENT) {
            ctx.addIssue({
              path: ["amount"],
              code: z.ZodIssueCode.too_small,
              minimum: MIN_PAYMENT,
              type: "number",
              inclusive: true,
              message: t("Amount must be at least {{MIN_PAYMENT}}", {
                MIN_PAYMENT,
              }),
            });
          }
          if (MAX_PAYMENT !== undefined && data.amount > MAX_PAYMENT) {
            ctx.addIssue({
              path: ["amount"],
              code: z.ZodIssueCode.too_big,
              maximum: MAX_PAYMENT,
              type: "number",
              inclusive: true,
              message: t("Amount must not exceed {{MAX_PAYMENT}}", {
                MAX_PAYMENT,
              }),
            });
          }
        }
      }
    });

export type CreateChaletPaymentType = z.infer<
  ReturnType<typeof createChaletPaymentSchema>
>;
