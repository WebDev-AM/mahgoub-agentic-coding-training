import { useQuery } from "@tanstack/react-query";
import { getUserCartApi } from "../../../services/apiCart";
import { UnifiedCartItem } from "../../../types/OrderSchema";

export function useCart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: getUserCartApi,
    staleTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error,
    cart: data as Record<string, UnifiedCartItem> | undefined,
  };
}
