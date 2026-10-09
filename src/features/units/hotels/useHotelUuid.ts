import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getHotelByUuidApi } from "../../../services/apiHotels";

export function useHotelUuid() {
  const { hotelUuid } = useParams();

  const {
    isLoading,
    data: hotel,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!hotelUuid,
    queryKey: [`hotels`, hotelUuid],
    queryFn: () => {
      return getHotelByUuidApi(hotelUuid as string);
    },
  });

  return { isLoading, error, hotel };
}
