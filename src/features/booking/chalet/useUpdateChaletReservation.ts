import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { updateChaletReservationApi } from "../../../services/apiChalets";

export function useUpdateChaletReservation() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateChaletReservationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success(t(`Reservation updated successfully`));
    },
    onError: () => {
      toast.error(t("Error updating reservation"));
    },
  });

  return { updateReservation: mutate, isUpdating: isPending };
}
