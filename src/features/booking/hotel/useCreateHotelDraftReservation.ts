import { useQuery } from "@tanstack/react-query";

import { createHotelDraftReservationApi } from "../../../services/apiHotels";
import { CreateHotelReservationType } from "../../../types/reservation/HotelResevationSchema";

export function useCreateHotelDraftReservation(
  reservationData: CreateHotelReservationType
) {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["hotel-draft-reservation", reservationData],
    queryFn: () => createHotelDraftReservationApi(reservationData),
  });

  return {
    reservation: data,
    isCreating: isLoading || isFetching,
    isError,
    error,
  };
}
