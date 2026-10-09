import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { register } from "../../services/apiAuth";
import { t } from "i18next";
import { getErrorMessage } from "../../utils/errorUtils";

export function useRegisterUser() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success(t(`User Registered Successfully`));
    },
    onError: (err) => {
      toast.error(
        t(getErrorMessage(err, "There was an error registering user"))
      );
    },
  });

  return { registerUser: mutateAsync, isRegistering: isPending };
}
