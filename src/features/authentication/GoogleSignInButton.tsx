import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { signInWithGoogleApi } from "../../services/apiAuth";
import { queryClient } from "../../services/reactQueryClient";
import { toast } from "react-toastify";
import { t } from "i18next";
import { getErrorMessage } from "../../utils/errorUtils";

function GoogleSignInButton() {
  const login = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (codeResponse) => {
      try {
        await signInWithGoogleApi({
          code: codeResponse.code,
          redirectUri: "postmessage",
        });
        queryClient.invalidateQueries({ queryKey: ["me"] });
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        toast.success(t(`Welcome back`));
      } catch (error) {
        console.error("Google sign-in callback failed", error);
        toast.error(
          t(getErrorMessage(error, "There was an error logging in with Google"))
        );
      }
    },

    onError: () => {
      console.log("Google login failed");
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      aria-label="Continue with Google"
      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md active:translate-y-0 active:scale-95"
    >
      <FcGoogle className="h-8 w-8" />
    </button>
  );
}

export default GoogleSignInButton;
