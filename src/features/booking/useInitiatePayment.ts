import { useQuery } from "@tanstack/react-query";
import { initiatePaymentApi } from "../../services/apiReservation";

export function useInitiatePayment(amount?: number) {
  const { isLoading, data, error } = useQuery({
    enabled: !!amount,
    staleTime: Infinity,
    queryKey: ["paymentMethods", amount],
    queryFn: () => initiatePaymentApi(amount!),
  });

  return {
    isLoading,
    error,
    paymentMethods: data,
  };
}
