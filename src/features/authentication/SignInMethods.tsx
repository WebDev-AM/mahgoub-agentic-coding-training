import GoogleSignInButton from "./GoogleSignInButton";
import FacebookSignInButton from "./FacebookSignInButton";

function SignInMethods() {
  return (
    <div className="flex items-center justify-center gap-4">
      <GoogleSignInButton />
      <FacebookSignInButton />
    </div>
  );
}

export default SignInMethods;
