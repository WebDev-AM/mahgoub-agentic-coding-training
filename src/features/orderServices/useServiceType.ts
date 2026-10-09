import { useQuery } from "@tanstack/react-query";

import { useParams } from "react-router-dom";
import { getServiceTypeApi } from "../../services/apiServices";

export function useServiceType(id?: number) {
  const { serviceTypeId } = useParams();
  const fetchId = id || serviceTypeId;

  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["serviceTypes", fetchId],
    queryFn: () => getServiceTypeApi(fetchId as number),
    enabled: !!fetchId,
  });

  return { isLoading, error, serviceType: data };
}
