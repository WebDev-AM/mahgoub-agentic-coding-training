import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAllProductsGroupedApi } from "../../services/apiServices";

export function useGroupedProducts() {
  const { serviceId } = useParams();

  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["products", serviceId],
    queryFn: () => getAllProductsGroupedApi(serviceId!),
  });

  return {
    isLoading,
    error,
    products: data ?? {},
  };
}
