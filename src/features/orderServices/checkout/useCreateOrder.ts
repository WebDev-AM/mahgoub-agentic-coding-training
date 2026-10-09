import { useMutation } from "@tanstack/react-query";
import { CreateOrderApi } from "../../../services/apiOrder";

export default function useCreateOrder() {
  const { mutate, isPending } = useMutation({
    mutationFn: CreateOrderApi,
  });

  return { createOrder: mutate, isCreating: isPending };
}
