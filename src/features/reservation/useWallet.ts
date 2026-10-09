import { useQuery } from "@tanstack/react-query";
import { getWalletByUserIdApi } from "../../services/apiReservation";
import { useMe } from "../authentication/useMe";

export function useWallet() {
  const { user } = useMe();
  const {
    isLoading,
    data: wallet,
    error,
  } = useQuery({
    staleTime: 8 * 60 * 1000,
    enabled: !!user?.id,
    queryKey: ["wallet", user?.id],
    queryFn: () => getWalletByUserIdApi(user?.id as string),
  });

  return { isLoading, error, wallet };
}
