import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { updateCartItemApi } from "../../../services/apiCart";

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItemApi(itemId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(t("Cart updated successfully"));
    },

    onError: () => {
      toast.error(t("Error updating cart item"));
    },
  });

  return { updateCartItem: mutate, isUpdating: isPending };
}
