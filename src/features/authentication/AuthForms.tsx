// components/auth/AuthForms.tsx
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterUserForm from "./RegisterUserForm";
// import VerifyOtpForm from "./VerifyOtpForm";
import { t } from "i18next";
import VerifyOtpForm from "./VerifyOtpForm";
import ForgotPasswordForm from "./ForgetPasswordForm";
import SignInMethods from "./SignInMethods";

type AuthStep = "login" | "register" | "verify-otp" | "forgot-password";

export default function AuthForms({ className }: { className?: string }) {
  const [step, setStep] = useState<AuthStep>("login");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [method, setMethod] = useState<"sms" | "email">();

  const handleVerifyRequest = (
    newSessionId: string,
    method: "sms" | "email"
  ) => {
    setSessionId(newSessionId);
    setMethod(method);
    setStep("verify-otp");
  };

  return (
    <div className={`min-w-70 rounded-lg md:min-w-190 ${className || ""}`}>
      {step === "login" && (
        <div className="flex flex-col gap-4">
          <LoginForm
            onLogin={handleVerifyRequest}
            onForgotPassword={() => setStep("forgot-password")}
          />
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">{t("Don't have an account?")}</span>
            <span
              onClick={() => setStep("register")}
              className="text-primary cursor-pointer font-medium hover:underline"
            >
              {t("Create account")}
            </span>
          </div>
          <SignInMethods />
        </div>
      )}

      {step === "register" && (
        <div className="flex flex-col gap-4">
          <RegisterUserForm onRegister={handleVerifyRequest} />
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">
              {t("Already have an account?")}
            </span>
            <span
              onClick={() => setStep("login")}
              className="text-primary cursor-pointer font-medium hover:underline"
            >
              {t("Sign in instead")}
            </span>
          </div>
          <SignInMethods />
        </div>
      )}

      {step === "verify-otp" && sessionId && method && (
        <VerifyOtpForm sessionId={sessionId} method={method} />
      )}

      {step === "forgot-password" && (
        <ForgotPasswordForm onBackToLogin={() => setStep("login")} />
      )}
    </div>
  );
}
