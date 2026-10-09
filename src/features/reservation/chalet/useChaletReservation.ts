import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChaletReservationApi } from "../../../services/apiReservation";

export function useChaletReservation(reservationId?: string) {
  const { id } = useParams();
  const fetchId = reservationId || id;

  const {
    isLoading,
    data: reservation,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!fetchId,
    queryKey: ["reservations", `${fetchId}`],
    queryFn: () => {
      return getChaletReservationApi(fetchId as string);
    },
  });

  return { isLoading, error, reservation };
}
