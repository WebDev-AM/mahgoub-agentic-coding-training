import { Chalet } from "../types/ChaletSchema";
import {
  ChaletReservation,
  CreateChaletReservationType,
  CreateChaletPaymentType,
} from "../types/reservation/ChaletReservationSchema";
import {
  CompletePaymentType,
  PromoCodeUsage,
  ReservationPeriod,
  UpdateReservationType,
} from "../types/reservation/ReservationsSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/chalets";

// Get Single Chalet
export async function getChaletApi(id: string) {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/${id}`);
  return data as Chalet;
}

// Get All Chalets
export async function getAllChaletsApi(queryObject: {
  [key: string]: string | number | boolean | undefined;
}) {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/list`, {
    params: queryObject,
  });

  return data as {
    content: Chalet[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// OUT OF CHALET MODULE

// Get Reservation Slots
export async function getChaletReservationSlots(id: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/${id}/available-periods`
  );
  return data as ReservationPeriod[];
}

// Create New Reservation
export async function createChaletReservationApi({
  chaletId,
  ...newReservation
}: CreateChaletReservationType) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/${chaletId}/reserve`,
    newReservation
  );
  return data as ChaletReservation;
}

// Create New Reservation
export async function createChaletDraftReservationApi({
  chaletId,
  ...newReservation
}: CreateChaletReservationType) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/${chaletId}/reserve/preview`,
    newReservation
  );
  return data as ChaletReservation;
}

// Apply Promocode
export async function applyChaletPromocodeApi(
  code: string,
  reservationId: string
) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/apply/${code}/reservation/${reservationId}`
  );
  return data as PromoCodeUsage;
}

// Create New Payment URL
export async function createChaletPaymentUrlApi(
  paymentDetails: CreateChaletPaymentType
) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/payment/generate-url`,
    paymentDetails
  );
  return data;
}

// Complete Payment
export async function completeChaletPaymentApi(
  paymentDetails: CompletePaymentType
) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/payment/complete-invoice`,
    paymentDetails
  );
  return data;
}

// Get Available priods for update
export async function getChaletPeriodsForUpdate(
  chaletId: string,
  reservationId: string
) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/${chaletId}/available-periods-except/${reservationId}`
  );
  return data as ReservationPeriod[];
}

const API_RESERVATION_ACTION_END_POINT_URL = "/api/chalets/reservation";

// Update Reservation
export async function updateChaletReservationApi({
  updatedReservation,
  chaletId,
}: {
  updatedReservation: UpdateReservationType;
  chaletId: string;
}) {
  const { data } = await customFetch.post(
    `${API_RESERVATION_ACTION_END_POINT_URL}/${chaletId}/update`,
    updatedReservation
  );
  return data;
}

// Cancel Reservation
export async function cancelChaletReservationApi(id: string) {
  const { data } = await customFetch.post(
    `${API_RESERVATION_ACTION_END_POINT_URL}/${id}/cancel`
  );

  return data;
}
