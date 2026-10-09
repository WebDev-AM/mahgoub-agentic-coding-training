import { useQuery } from "@tanstack/react-query";
import { getAllPlacesApi } from "../../services/apiReservation";
import { useFilters } from "../../hooks/useFilters";
import { useState } from "react";

export function useUnits(filters = {}) {
  const [promoterId] = useState(() => {
    return (
      new URL(window.location.href).searchParams.get("promoter") ||
      sessionStorage.getItem("session_promoter") ||
      undefined
    );
  });
  const [ownerId] = useState(() => {
    return (
      new URL(window.location.href).searchParams.get("owner") ||
      sessionStorage.getItem("session_owner") ||
      undefined
    );
  });
  const { params, dispatch } = useFilters();
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    queryKey: ["units", params, filters, promoterId, ownerId],
    queryFn: () => {
      return getAllPlacesApi({ ...params, ...filters, promoterId, ownerId });
    },
  });

  return {
    isLoading,
    error,
    units: data?.content,
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
    filtersDispatch: dispatch,
  };
}
