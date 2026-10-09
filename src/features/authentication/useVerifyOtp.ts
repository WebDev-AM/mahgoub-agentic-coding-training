import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { verifyOtpApi } from "../../services/apiAuth";
import { t } from "i18next";
import { getErrorMessage } from "../../utils/errorUtils";

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(
        t(params.newPassword ? `Password reset successfully` : `Welcome back`)
      );
    },
    onError: (error) => {
      toast.error(t(getErrorMessage(error, "Something went wrong")));
    },
  });

  return { verifyOtp: mutate, isVerifying: isPending };
}
