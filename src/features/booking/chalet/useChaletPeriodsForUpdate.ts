import { useQuery } from "@tanstack/react-query";
import { getChaletPeriodsForUpdate } from "../../../services/apiChalets";

export function useChaletPeriodsForUpdate(
  chaletId?: string,
  reservationId?: string
) {
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["reservations", "periods", chaletId, reservationId],
    queryFn: () => {
      return getChaletPeriodsForUpdate(chaletId!, reservationId!);
    },
    enabled: !!chaletId && !!reservationId,
  });

  return {
    isLoading,
    error,
    periods: data,
  };
}
