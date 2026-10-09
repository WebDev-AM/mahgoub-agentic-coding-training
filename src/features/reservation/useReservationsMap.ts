import { useQuery } from "@tanstack/react-query";
import { getReservationsMapApi } from "../../services/apiReservation";

export function useReservationsMap({
  reservationIds,
}: {
  reservationIds: string[];
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reservations-map", reservationIds],
    queryFn: () => getReservationsMapApi(reservationIds),
    enabled: reservationIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error,
    reservations: data,
  };
}
