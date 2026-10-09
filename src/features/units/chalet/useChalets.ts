import { useQuery } from "@tanstack/react-query";
import { Chalet } from "../../../types/ChaletSchema";
import { getAllChaletsApi } from "../../../services/apiChalets";
import { useFilters } from "../../../hooks/useFilters";
import { useState } from "react";

export function useChalets(filters = {}) {
  const [promoterId] = useState(() => {
    return (
      new URL(window.location.href).searchParams.get("promoter") ||
      sessionStorage.getItem("session_promoter") ||
      undefined
    );
  });
  const { params, dispatch } = useFilters();
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    queryKey: ["chalets", params, filters, promoterId],
    queryFn: () => {
      return getAllChaletsApi({ ...params, ...filters, promoterId });
    },
  });

  return {
    isLoading,
    error,
    chalets: data?.content as Chalet[],
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
    filtersDispatch: dispatch,
  };
}
