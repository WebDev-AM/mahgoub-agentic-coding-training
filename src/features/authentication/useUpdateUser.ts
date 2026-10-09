import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { t } from "i18next";

import { updateUserApi } from "../../services/apiAuth";
import { getErrorMessage } from "../../utils/errorUtils";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(t(`User Updated Successfully`));
    },
    onError: (err) => {
      toast.error(t(getErrorMessage(err, "There was an error updating user")));
    },
  });

  return { updateUser: mutateAsync, isUpdating: isPending };
}
