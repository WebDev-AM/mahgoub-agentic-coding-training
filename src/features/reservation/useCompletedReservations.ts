import { useQuery } from "@tanstack/react-query";
import { getAllReservationsApi } from "../../services/apiReservation";

export function useCompletedReservations(filters = {}) {
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["reservations", "completed", filters],
    queryFn: () => {
      return getAllReservationsApi({ ...filters, isUpcoming: false });
    },
  });

  return {
    isLoading,
    error,
    reservations: data?.content,
    count: data?.totalElements as number,
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
  };
}
