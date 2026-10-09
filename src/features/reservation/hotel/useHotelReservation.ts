import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getHotelReservationApi } from "../../../services/apiHotels";

export function useHotelReservation(reservationId?: string) {
  const { id } = useParams();
  const fetchId = reservationId || id;

  const {
    isLoading,
    data: reservation,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!fetchId,
    queryKey: ["hotel-reservations", `${fetchId}`],
    queryFn: () => {
      return getHotelReservationApi(fetchId as string);
    },
  });

  return { isLoading, error, reservation };
}
