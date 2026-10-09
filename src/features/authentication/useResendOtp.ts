import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { resendOtpApi } from "../../services/apiAuth";
import { t } from "i18next";

export function useResendOtp() {
  const { mutate, isPending } = useMutation({
    mutationFn: resendOtpApi,
    onSuccess: () => {
      toast.success(t(`New OTP sent successfully`));
    },
    onError: () => {
      toast.error(t("Error sending OTP"));
    },
  });

  return { resendOtp: mutate, isResending: isPending };
}
