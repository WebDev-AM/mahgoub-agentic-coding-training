import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryZonesApi } from "../../../services/apiOrder";

export function useDeliveryZones() {
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["delivery-zones"],
    queryFn: getAllDeliveryZonesApi,
  });

  return {
    isLoading,
    error,
    deliveryZones: data || [],
  };
}
