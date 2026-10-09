import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";

import { createChaletReservationApi } from "../../../services/apiChalets";

export function useCreateChaletReservation() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createChaletReservationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservationsPeriods"] });
      toast.success(t(`Reservation created successfully`));
    },
    onError: () => {
      toast.error(t("Error creating new reservation"));
    },
  });

  return { createReservation: mutate, isCreating: isPending };
}
