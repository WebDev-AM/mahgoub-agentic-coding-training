import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../../services/apiOrder";
import { useFilters } from "../../../hooks/useFilters";

export function useMyOrders() {
  const { params, dispatch } = useFilters();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders", params],
    queryFn: () => getMyOrders(params),
    staleTime: 10 * 60 * 1000,
  });

  return {
    isLoading,
    error,
    orders: data?.content,
    count: data?.totalElements as number,
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
    filtersDispatch: dispatch,
  };
}
