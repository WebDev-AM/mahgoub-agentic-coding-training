import { useQuery } from "@tanstack/react-query";
import { getAllCountriesApi } from "../../services/apiAddress";

export function useCountryAddresses(filters = {}) {
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["country-addresses", filters],
    queryFn: () => getAllCountriesApi(filters),
  });

  return {
    isLoading,
    error,
    countryAddresses: data?.content,
    totalPages: data?.totalPages,
    pageNumber: data?.pageable?.pageNumber,
  };
}
