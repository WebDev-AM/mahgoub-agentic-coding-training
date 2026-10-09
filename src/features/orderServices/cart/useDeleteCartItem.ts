import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { deleteCartItemApi } from "../../../services/apiCart";
import { UserDetails } from "../../../types/AuthSchema";

export function useDeleteCartItem() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (itemId: string) => {
      const userId = queryClient.getQueryData<UserDetails>(["me"])?.id;
      return deleteCartItemApi({ itemId, userId });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(t("Cart item deleted successfully"));
    },

    onError: () => {
      toast.error(t("Error deleting cart item"));
    },
  });

  return { deleteCartItem: mutate, isDeleting: isPending };
}
