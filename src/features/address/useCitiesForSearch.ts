import { useQuery } from "@tanstack/react-query";
import { getCitiesForSearch } from "../../services/apiAddress";

export function useCitiesForSearch(filters = {}, enabled = true) {
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    enabled,
    queryKey: ["cities-for-search", filters],
    queryFn: () => getCitiesForSearch(filters),
  });

  return {
    isLoading,
    error,
    cityAddresses: enabled ? (data?.content ?? []) : [],
    totalPages: data?.totalPages,
    pageNumber: data?.pageable?.pageNumber,
  };
}
