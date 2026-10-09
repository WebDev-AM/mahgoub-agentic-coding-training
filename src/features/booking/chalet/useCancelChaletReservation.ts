import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { cancelChaletReservationApi } from "../../../services/apiChalets";

export function useCancelChaletReservation() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: cancelChaletReservationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      toast.success(t(`Reservation canceled successfully`));
    },
    onError: () => {
      toast.error(t("Error canceling reservation"));
    },
  });

  return { cancelReservation: mutate, isCanceling: isPending };
}
