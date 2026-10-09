import { useQuery } from "@tanstack/react-query";
import { getOrderByOrderNumberApi } from "../../../services/apiOrder";

export function useOrder(orderNumber: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => getOrderByOrderNumberApi(orderNumber),
    staleTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error,
    order: data,
  };
}
