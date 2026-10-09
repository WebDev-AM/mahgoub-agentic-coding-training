import { Hotel } from "../types/HotelSchema";
import {
  BookingReservationItem,
  PaymentMethod,
  Wallet,
} from "../types/reservation/ReservationsSchema";
import {
  ChaletInvoice,
  ChaletReservation,
} from "../types/reservation/ChaletReservationSchema";
import { HotelReservation } from "../types/reservation/HotelResevationSchema";
import { Chalet } from "../types/ChaletSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/salamwebbff";

// Get All Places
export async function getAllPlacesApi(queryObject: {
  [key: string]: string | number | boolean | undefined;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/discovery/list?`,
    {
      params: queryObject,
    }
  );

  return data as {
    content: (Chalet | Hotel)[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Get All Reservations
export async function getAllReservationsApi(queryObject: {
  [key: string]: string | number | boolean;
}) {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/my-bookings`, {
    params: queryObject,
  });

  return data as {
    content: BookingReservationItem[];
    totalPages: number;
    totalElements: number;
    pageable: { pageNumber: number };
  };
}

// Get Reservation Details
export async function getChaletReservationApi(reservationId: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/reservations/${reservationId}`
  );

  return data as ChaletReservation;
}

// Get Invoice Details
export async function getChaletInvoiceApi(invoiceId: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/invoices/${invoiceId}`
  );

  return data as ChaletInvoice;
}

export async function getReservationsMapApi(reservationIds: string[]) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/reservation/details-map`,
    reservationIds
  );
  return data as Record<string, ChaletReservation | HotelReservation>;
}

const API_PAYMENT_END_POINT_URL = "/api/payments";

// Initiate Payment to get payment methids
export async function initiatePaymentApi(amount: number) {
  const { data } = await customFetch.post(
    `${API_PAYMENT_END_POINT_URL}/gateway/initiate`,
    {
      amount,
    }
  );
  return data as PaymentMethod[];
}

export async function getWalletByUserIdApi(userId: string) {
  const { data } = await customFetch.get(
    `${API_PAYMENT_END_POINT_URL}/wallet/user/${userId}`
  );

  return data as Wallet;
}

const API_FEES_END_POINT_URL = "/api/reservations";

// Get Applied fees
export async function getAppliedFees({
  reservationId,
  type,
}: {
  reservationId: string;
  type: "UPDATE" | "CANCELLATION";
}) {
  const { data } = await customFetch.get(
    `${API_FEES_END_POINT_URL}/${reservationId}/operation-fee`,
    {
      params: { type },
    }
  );
  return data as number;
}
