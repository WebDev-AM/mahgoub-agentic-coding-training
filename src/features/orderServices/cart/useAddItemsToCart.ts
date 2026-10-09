import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { addItemsToCartApi } from "../../../services/apiCart";

export function useAddItemsToCart() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (items: { productId: string; quantity: number }[]) =>
      addItemsToCartApi(items),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(t("Items added to cart successfully"));
    },

    onError: () => {
      toast.error(t("Error adding items to cart"));
    },
  });

  return { addItemsToCart: mutate, isAdding: isPending };
}
