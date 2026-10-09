import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logout } from "../../services/apiAuth";
import { t } from "i18next";

export default function useLogout() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null);
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries();
      toast.success(t("Logged out successfully"));
    },
    onError: () => {
      toast.error(t("Could not log you out"));
    },
  });

  return { logout: mutate, isLoggingOut: isPending };
}
