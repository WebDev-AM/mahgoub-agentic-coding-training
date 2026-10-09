import { ReservationUser } from "./ChaletReservationSchema";
import { t } from "i18next";
import { z } from "zod";
import { Hotel, RoomGroup } from "../HotelSchema";
import { Rating } from "./RatingSchema";

export type HotelReservation = {
  uuid: string;
  groupCode: string;

  guestId: string;
  promoterId: string | null;

  entityId: string[];
  entityType: "HOTEL";

  hotel: Hotel; // replace with Hotel type if available

  totalCost: number;
  totalSubtotal: number;
  totalInsurance: number;
  totalPromotedCommission: number;
  totalCommission: number;
  totalFee: number;

  paymentId: string | null;
  paymentStatus: "PAID" | "PENDING" | "FAILED" | "FREE_CANCELLATION";

  note: string | null;
  status: "CONFIRMED" | "CANCELLED" | "PENDING" | "REPLACED";

  begin: string; // ISO date
  end: string; // ISO date

  createdAt: string;
  updatedAt: string;

  rating?: Rating;

  user: ReservationUser;

  groupInvoice: HotelInvoice;

  groupUnitTypes: HotelReservationUnit[];
};

export type HotelInvoice = {
  groupInvoiceNumber: string;
  groupReservationId: string;

  userId: string;
  promoterId: string | null;

  totalAmount: number;
  totalPaidAmount: number;
  totalRemainingAmount: number;

  totalDiscount: number;
  overpaymentAmount: number;
  lateFee: number;

  currency: string;

  groupInvoiceStatus:
    | "PAID"
    | "PENDING"
    | "PARTIALLY_PAID"
    | "FREE_CANCELLATION";

  dueDate: string;

  createdAt: string;
  updatedAt: string;
};

export type HotelReservationUnit = {
  unitType: RoomGroup;

  count: number;

  totalCost: number;
  totalSubtotal: number;
  totalInsurance: number;

  totalPromotedCommission: number;
  totalCommission: number;
  totalFee: number;
};

export type CreateHotelReservationType = {
  requestedRoomsPerUnitType: Record<string, number>;
  promoterId: string | null;
  source?: "OWNER_SHARE";
  note?: string;
  begin: string;
  end: string;
};

export const createHotelPaymentSchema = z.object({
  groupReservationId: z.string(),
  isWalletPayment: z.boolean(),
  usageId: z.string().nullable().optional(),
  paymentMethod: z.number({
    required_error: t("Please select a payment method"),
  }),
  language: z.string(),
});

export type CreateHotelPaymentType = z.infer<typeof createHotelPaymentSchema>;
