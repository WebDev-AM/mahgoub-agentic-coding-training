import { useQuery } from "@tanstack/react-query";
import { getChaletReservationSlots } from "../../../../services/apiChalets";

export function useChaletReservationPeriods(id: string) {
  const { isLoading, data, error } = useQuery({
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    queryKey: ["reservationsPeriods", id],
    queryFn: () => {
      return getChaletReservationSlots(id as string);
    },
  });

  return {
    isLoading,
    error,
    periods: data,
  };
}
