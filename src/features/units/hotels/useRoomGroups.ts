import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRoomGroupsApi } from "../../../services/apiHotels";
import { useFilters } from "../../../hooks/useFilters";

export function useRoomGroups(filters = {}) {
  const { hotelUuid } = useParams();
  const { params, dispatch } = useFilters();
  const { isLoading, data, error } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["roomGroups", hotelUuid, params, filters],
    queryFn: () => {
      return getRoomGroupsApi({
        hotelId: hotelUuid as string,
        ...params,
        ...filters,
      });
    },
  });

  return {
    isLoading,
    error,
    roomGroups: data?.content,
    totalPages: data?.totalPages as number,
    pageNumber: data?.pageable?.pageNumber as number,
    filtersDispatch: dispatch,
  };
}
