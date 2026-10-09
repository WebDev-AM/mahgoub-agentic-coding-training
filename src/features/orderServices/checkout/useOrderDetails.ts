import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getOrderDetailsApi } from "../../../services/apiOrder";

export function useOrderDetails(id?: string) {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const fetchId = id || orderId;

  const { isLoading, data, error } = useQuery({
    queryKey: ["orders", fetchId],
    queryFn: () => getOrderDetailsApi(fetchId as string),
    enabled: !!fetchId,
    staleTime: 5 * 60 * 1000,
  });

  return { isLoading, error, order: data };
}
