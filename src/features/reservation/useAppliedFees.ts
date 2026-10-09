import { useQuery } from "@tanstack/react-query";
import { getAppliedFees } from "../../services/apiReservation";

export function useAppliedFees({
  reservationId,
  type,
}: {
  reservationId?: string;
  type: "CANCELLATION" | "UPDATE";
}) {
  const {
    isLoading,
    data: fees,
    error,
  } = useQuery({
    staleTime: 0,
    queryKey: [`fees`, reservationId, type],
    queryFn: () => {
      return getAppliedFees({ reservationId: reservationId as string, type });
    },
    enabled: !!reservationId,
  });

  return { isLoading, error, fees };
}
