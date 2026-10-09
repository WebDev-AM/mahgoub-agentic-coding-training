import { useQuery } from "@tanstack/react-query";
import { getAllRatingsForResource } from "../../services/apiRating";

export function useResourceRatings(resourceType?: string, resourceId?: string) {
  const {
    isLoading,
    data: ratings,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!resourceType && !!resourceId,
    queryKey: ["resource-ratings", resourceType, resourceId],
    queryFn: () =>
      getAllRatingsForResource({
        resourceType: resourceType as string,
        resourceId: resourceId as string,
      }),
  });

  return { isLoading, error, ratings };
}
