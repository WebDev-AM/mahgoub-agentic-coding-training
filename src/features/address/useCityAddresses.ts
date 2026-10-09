import { useQuery } from "@tanstack/react-query";
import { getAllCitiesApi } from "../../services/apiAddress";

export function useCityAddresses(filters = {}, enabled = true) {
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    enabled,
    queryKey: ["city-addresses", filters],
    queryFn: () => getAllCitiesApi(filters),
  });

  return {
    isLoading,
    error,
    cityAddresses: enabled ? (data?.content ?? []) : [],
    totalPages: data?.totalPages,
    pageNumber: data?.pageable?.pageNumber,
  };
}
