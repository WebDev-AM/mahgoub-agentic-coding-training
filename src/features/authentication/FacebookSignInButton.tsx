import FacebookLogin from "@greatsumini/react-facebook-login";
import { FaFacebookF } from "react-icons/fa";
import { signInWithFacebookApi } from "../../services/apiAuth";
import { queryClient } from "../../services/reactQueryClient";
import { toast } from "react-toastify";
import { t } from "i18next";
import { getErrorMessage } from "../../utils/errorUtils";

function FacebookSignInButton() {
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID;

  return (
    <FacebookLogin
      appId={appId}
      useRedirect={false}
      loginOptions={{ return_scopes: true }}
      onSuccess={async (response) => {
        const accessToken = response.accessToken;
        console.log("Facebook login successful, access token:", accessToken);
        if (!accessToken) {
          console.error("Facebook login succeeded without an access token");
          return;
        }

        try {
          await signInWithFacebookApi({ accessToken });
          queryClient.invalidateQueries({ queryKey: ["me"] });
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(t(`Welcome back`));
        } catch (error) {
          console.error("Facebook sign-in callback failed", error);
          toast.error(
            t(
              getErrorMessage(
                error,
                "There was an error logging in with Facebook"
              )
            )
          );
        }
      }}
      onFail={(error) => {
        console.log("Facebook login failed", error);
      }}
      render={({ onClick }) => (
        <button
          type="button"
          onClick={onClick}
          aria-label="Continue with Facebook"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-[#1877F2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md active:translate-y-0 active:scale-95"
        >
          <FaFacebookF className="h-7 w-7 text-white" />
        </button>
      )}
    />
  );
}

export default FacebookSignInButton;
