import { useQuery } from "@tanstack/react-query";
import { getCountryAddressApi } from "../../services/apiAddress";

export function useCountryAddress(countryId?: string) {
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!countryId,
    queryKey: ["country-address", countryId],
    queryFn: () => getCountryAddressApi(countryId as string),
  });

  return {
    isLoading,
    error,
    countryAddress: data,
  };
}
