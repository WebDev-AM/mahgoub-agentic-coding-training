import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getHotelApi } from "../../../services/apiHotels";

export function useHotel() {
  const { hotelId } = useParams();

  const {
    isLoading,
    data: hotel,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!hotelId,
    queryKey: [`hotels`, hotelId],
    queryFn: () => {
      return getHotelApi(+(hotelId as string));
    },
  });

  return { isLoading, error, hotel };
}
