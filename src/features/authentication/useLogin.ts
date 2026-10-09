import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { login } from "../../services/apiAuth";
import { t } from "i18next";
import { getErrorMessage } from "../../utils/errorUtils";

export function useLogin() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.sessionId) return;
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(t(`Welcome back`));
    },
    onError: (err) => {
      toast.error(
        t(getErrorMessage(err, "Provided email or password are incorrect"))
      );
    },
  });

  return { loginUser: mutateAsync, isLogging: isPending };
}
