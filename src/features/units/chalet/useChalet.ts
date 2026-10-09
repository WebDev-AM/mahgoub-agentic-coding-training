import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getChaletApi } from "../../../services/apiChalets";

export function useChalet(chaletId?: string) {
  const { id } = useParams();
  const fetchId = chaletId || id;

  const {
    isLoading,
    data: chalet,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!fetchId,
    queryKey: [`chalet/${fetchId}`],
    queryFn: () => {
      return getChaletApi(fetchId as string);
    },
  });

  return { isLoading, error, chalet };
}
