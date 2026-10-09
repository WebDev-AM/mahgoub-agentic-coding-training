import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";

import { getErrorMessage } from "../../utils/errorUtils";
import { deleteRatingApi } from "../../services/apiRating";

export function useDeleteReservationRating() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteRatingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["hotel-reservations"] });
      toast.success(t("Rating deleted successfully"));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, t("Error deleting rating")));
    },
  });

  return {
    deleteReservationRating: mutate,
    isDeleting: isPending,
  };
}
