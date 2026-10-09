import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PayOrderApi } from "../../../services/apiOrder";

export default function usePayOrder() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: PayOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return { payOrder: mutate, isPaying: isPending };
}
