import { useQuery } from "@tanstack/react-query";
import { getCityAddressApi } from "../../services/apiAddress";

export function useCityAddress(cityId?: string) {
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!cityId,
    queryKey: ["city-address", cityId],
    queryFn: () => getCityAddressApi(cityId as string),
  });

  return {
    isLoading,
    error,
    cityAddress: data,
  };
}
