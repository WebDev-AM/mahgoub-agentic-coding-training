import { useQuery } from "@tanstack/react-query";
import { getCityActivePopulatedPlacesApi } from "../../services/apiAddress";

export function useCityPopulatedPlaces(cityId: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["populated-places", cityId],
    queryFn: () => getCityActivePopulatedPlacesApi(cityId),
    enabled: !!cityId,
  });

  return { isLoading, error, populatedPlaces: data ?? [] };
}
