import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { requestPasswordResetApi } from "../../services/apiAuth";

export function useRequestPasswordReset() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: requestPasswordResetApi,
    onSuccess: () => {
      toast.success(t(`OTP successfully sent to you`));
    },
    onError: () => {
      toast.error(t("Error sending OTP"));
    },
  });

  return { requestPasswordReset: mutateAsync, isRequesting: isPending };
}
