import { Hotel, RoomGroup } from "../types/HotelSchema";
import {
  CreateHotelPaymentType,
  CreateHotelReservationType,
  HotelReservation,
} from "../types/reservation/HotelResevationSchema";
import { PromoCodeUsage } from "../types/reservation/ReservationsSchema";
import customFetch from "./customFetch";

const API_END_POINT_URL = "/api/hotels";

// Get Hotel by ID
export async function getHotelApi(hotelId: number) {
  const { data } = await customFetch.get(`${API_END_POINT_URL}/${hotelId}`);
  return data as Hotel;
}

// Get Hotel by UUID
export async function getHotelByUuidApi(hotelUuid: string) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/uuid/${hotelUuid}`
  );
  return data as Hotel;
}

// List Room Groups (Paginated)
export async function getRoomGroupsApi(queryObject: {
  [key: string]: string | number;
}) {
  const { data } = await customFetch.get(
    `${API_END_POINT_URL}/unit-types/list`,
    {
      params: queryObject,
    }
  );

  return data as {
    content: RoomGroup[];
    totalPages: number;
    pageable: { pageNumber: number };
  };
}

// Hotel Reservation Details (Group)
export async function getHotelReservationApi(uuidOrCode: string) {
  const { data } = await customFetch.get(
    `/api/salamwebbff/group-reservations/${uuidOrCode}`
  );
  return data as HotelReservation;
}

// Create Hotel Reservation (Group)
export async function createHotelReservationApi(
  newReservation: CreateHotelReservationType
) {
  newReservation.begin = newReservation.begin + "T14:00:00";
  newReservation.end = newReservation.end + "T12:00:00";
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/reservation/multi`,
    newReservation
  );

  return data as HotelReservation;
}

// Create Hotel Reservation (Group)
export async function createHotelDraftReservationApi(
  newReservation: CreateHotelReservationType
) {
  newReservation.begin = newReservation.begin + "T14:00:00";
  newReservation.end = newReservation.end + "T12:00:00";
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/reservation/preview`,
    newReservation
  );

  return data as HotelReservation;
}

// Create Hotel Payment URL (Group)
export async function createHotelPaymentUrlApi(
  paymentDetails: CreateHotelPaymentType
) {
  const payload = {
    ...paymentDetails,
    isFullPayment: true,
  };
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/payment/group/generate-url`,
    payload
  );

  return data;
}

// Apply Hotel Promocode (Group)
export async function applyHotelPromocodeApi(
  code: string,
  groupReservationId: string
) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/apply/${code}/group-reservation/${groupReservationId}`
  );

  return data as PromoCodeUsage;
}

// Cancel Hotel Reservation (Group)
export async function cancelHotelReservationApi(groupReservationId: string) {
  const { data } = await customFetch.post(
    `${API_END_POINT_URL}/reservation/group/${groupReservationId}/cancel`
  );

  return data;
}
