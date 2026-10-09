import { useQuery } from "@tanstack/react-query";

import { useFilters } from "../../hooks/useFilters";
import { getAllServiceTypesApi } from "../../services/apiServices";
import { ServiceType } from "../../types/ServiceSchema";

export function useServiceTypes(filters = {}) {
  const { params, dispatch } = useFilters();
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    queryKey: ["service-types", { ...params, ...filters }],
    queryFn: () => {
      return getAllServiceTypesApi({ ...params, ...filters });
    },
  });

  return {
    isLoading,
    error,
    serviceTypes: data?.content as ServiceType[],
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
    filtersDispatch: dispatch,
  };
}
