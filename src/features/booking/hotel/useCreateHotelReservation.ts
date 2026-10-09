import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";

import { createHotelReservationApi } from "../../../services/apiHotels";

export function useCreateHotelReservation() {
  const { mutate, isPending } = useMutation({
    mutationFn: createHotelReservationApi,
    onSuccess: () => {
      toast.success(t("Reservation created successfully"));
    },
    onError: () => {
      toast.error(t("Error creating new reservation"));
    },
  });

  return { createReservation: mutate, isCreating: isPending };
}
