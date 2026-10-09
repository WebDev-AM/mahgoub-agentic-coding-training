import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteProfileImageApi } from "../../services/apiAuth";
import { t } from "i18next";
import { queryClient } from "../../services/reactQueryClient";

export function useDeleteProfileImage() {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteProfileImageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(t(`Profile Image Deleted Successfully`));
    },
    onError: () => {
      toast.error(t("There was an error deleting profile image"));
    },
  });

  return { deleteProfileImage: mutate, isDeleting: isPending };
}
