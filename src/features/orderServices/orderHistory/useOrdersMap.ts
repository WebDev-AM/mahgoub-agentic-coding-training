import { useQuery } from "@tanstack/react-query";
import { getOrdersMap } from "../../../services/apiOrder";

export function useOrdersMap({ orderNumbers }: { orderNumbers: string[] }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders-map", orderNumbers],
    queryFn: () => getOrdersMap(orderNumbers),
    enabled: orderNumbers.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error,
    orders: data,
  };
}
