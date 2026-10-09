import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { uploadProfileImageApi } from "../../services/apiAuth";
import { t } from "i18next";
import { queryClient } from "../../services/reactQueryClient";

export function useUploadProfileImage() {
  const { mutate, isPending } = useMutation({
    mutationFn: uploadProfileImageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(t(`Profile Image Uploaded Successfully`));
    },
    onError: () => {
      toast.error(t("There was an error uploading profile image"));
    },
  });

  return { uploadProfileImage: mutate, isUploading: isPending };
}
