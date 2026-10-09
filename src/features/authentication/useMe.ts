import { useQuery } from "@tanstack/react-query";
import { apiMe } from "../../services/apiAuth";

export function useMe() {
  const { isLoading, data, error } = useQuery({
    staleTime: 8 * 60 * 1000,
    queryKey: ["me"],
    queryFn: apiMe,
  });

  return {
    isLoading,
    error,
    user: data,
  };
}
