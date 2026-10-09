import { useQuery } from "@tanstack/react-query";

import { useFilters } from "../../hooks/useFilters";
import { getAllServicesApi } from "../../services/apiServices";
import { Service } from "../../types/ServiceSchema";
import { useParams } from "react-router-dom";

export function useServices() {
  const { serviceTypeId } = useParams();
  const { params, dispatch } = useFilters();
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    queryKey: ["services", Number(serviceTypeId), params],
    queryFn: () => {
      return getAllServicesApi({
        typeId: Number(serviceTypeId),
        ...params,
      });
    },
  });

  return {
    isLoading,
    error,
    services: data?.content as Service[],
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
    filtersDispatch: dispatch,
  };
}
