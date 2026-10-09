import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";

import { getErrorMessage } from "../../utils/errorUtils";
import { createRatingApi } from "../../services/apiRating";

export function useCreateReservationRating() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createRatingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-reservations"] });
      toast.success(t("Rating created successfully"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("Error creating rating")));
    },
  });

  return {
    createReservationRating: mutate,
    isCreating: isPending,
  };
}
