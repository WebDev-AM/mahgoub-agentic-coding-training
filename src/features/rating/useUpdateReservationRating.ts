import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";

import { getErrorMessage } from "../../utils/errorUtils";
import { updateRatingApi } from "../../services/apiRating";

export function useUpdateReservationRating() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateRatingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-reservations"] });
      toast.success(t("Rating updated successfully"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("Error updating rating")));
    },
  });

  return {
    updateReservationRating: mutate,
    isUpdating: isPending,
  };
}
