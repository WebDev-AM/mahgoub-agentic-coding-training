import { useQuery } from "@tanstack/react-query";
import { createChaletDraftReservationApi } from "../../../services/apiChalets";
import { CreateChaletReservationType } from "../../../types/reservation/ChaletReservationSchema";

export function useCreateChaletDraftReservation(
  reservationData: CreateChaletReservationType
) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["chalet-draft-reservation", reservationData],
    queryFn: () => createChaletDraftReservationApi(reservationData),
  });

  return {
    reservation: data,
    isLoading: isPending,
    isError,
    error,
  };
}
