import { useQuery } from "@tanstack/react-query";
import { getMyOngoingOrders } from "../../../services/apiOrder";
import { useFilters } from "../../../hooks/useFilters";

export function useMyOngoingOrders() {
  const { params, dispatch } = useFilters();
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-ongoing-orders", params],
    queryFn: () => getMyOngoingOrders(params),
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
