import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";
import { pushNotificationToPortalApi } from "../services/apiNotification";

export function usePushToPortal() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: pushNotificationToPortalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t(`Notification sent successfully`));
    },
    onError: () => {
      toast.error(t("Error sending notification"));
    },
  });

  return { pushNotificationToPortal: mutate, isPushing: isPending };
}
