import { useQuery } from "@tanstack/react-query";
import { getServiceApi } from "../../services/apiServices";
import { useParams } from "react-router-dom";

export function useService(id?: string) {
  const { serviceId } = useParams();
  const fetchId = id || serviceId;

  const { isLoading, data, error } = useQuery({
    queryKey: ["services", fetchId],
    queryFn: () => getServiceApi(fetchId as string),
    enabled: !!fetchId,
  });

  return { isLoading, error, service: data };
}
