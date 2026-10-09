import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputAdornment, TextField } from "@mui/material";
import { t } from "i18next";
import { MuiTelInput } from "mui-tel-input";
import HeadingText from "../../ui/HeadingText";
import {
  RequestPasswordResetSchema,
  RequestPasswordResetType,
  ResetPasswordSchema,
  ResetPasswordType,
} from "../../types/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRequestPasswordReset } from "./useRequestPasswordReset";
import { useVerifyOtp } from "./useVerifyOtp";
import { FaLock as PasswordIcon } from "react-icons/fa";
import FormRow from "../../ui/FormRow";
import PasswordVisibility from "./PasswordVisibility";
import { useResendOtp } from "./useResendOtp";

type ForgotPasswordFormProps = {
  onBackToLogin: () => void;
};

type Step = "request" | "reset";

export default function ForgotPasswordForm({
  onBackToLogin,
}: ForgotPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("request");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 1: Request reset
  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    formState: { errors: requestErrors },
    control: requestControl,
    reset,
  } = useForm<RequestPasswordResetType>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  const { requestPasswordReset, isRequesting } = useRequestPasswordReset();

  const handleRequest = async (data: RequestPasswordResetType) => {
    try {
      const response = await requestPasswordReset(data);
      setSessionId(response.sessionId);
      setStep("reset");
      setResendCooldown(30);
    } catch (error) {
      console.error("Request reset failed", error);
    }
  };

  // Step 2: Reset password
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { verifyOtp, isVerifying } = useVerifyOtp();
  const { resendOtp, isResending } = useResendOtp();

  const [type, setType] = useState<"email" | "phone">("email");

  const handleReset = (data: ResetPasswordType) => {
    try {
      if (sessionId) {
        verifyOtp(
          {
            ...data,
            sessionId,
          },
          { onSuccess: () => onBackToLogin() }
        );
      }
    } catch (error) {
      console.error("Reset password failed", error);
    }
  };

  // Countdown effect for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendOtp = () => {
    if (resendCooldown > 0 || isResending) return;
    resendOtp(sessionId!);
    setResendCooldown(30);
  };

  return (
    <div>
      <HeadingText className="text-primary !block">
        {t(step === "request" ? "Forgot Password" : "Reset Password")}
      </HeadingText>
      <p className="mb-2 text-center text-xl font-light">
        {t(
          step === "request"
            ? "Enter your email or phone to receive an OTP."
            : "Enter the OTP and your new password."
        )}
      </p>

      {step === "request" && (
        <form onSubmit={handleRequestSubmit(handleRequest)}>
          <div className="border-secondary-dark mb-4 flex h-9 w-70 flex-shrink-0 overflow-hidden rounded-lg border-2">
            <button
              type="button"
              className={`flex-1 cursor-pointer transition-all ${
                type === "email" && "bg-primary font-bold text-white"
              }`}
              onClick={() => {
                setType("email");
                reset();
              }}
            >
              {t("Email")}
            </button>
            <button
              type="button"
              className={`flex-1 cursor-pointer transition-all ${
                type === "phone" && "bg-primary font-bold text-white"
              }`}
              onClick={() => {
                setType("phone");
                reset();
              }}
            >
              {t("Mobile Number")}
            </button>
          </div>
          <FormRow>
            {type === "email" ? (
              <TextField
                size="small"
                label={t("Email")}
                placeholder={t("Email")}
                {...registerRequest("email")}
                error={!!requestErrors.email}
                helperText={t(requestErrors.email?.message || "")}
                fullWidth
              />
            ) : (
              <Controller
                name="phoneNumber"
                control={requestControl}
                render={({ field }) => (
                  <MuiTelInput
                    size="small"
                    fullWidth
                    dir="ltr"
                    defaultCountry="KW"
                    value={field.value || ""}
                    error={!!requestErrors.phoneNumber}
                    helperText={t(requestErrors.phoneNumber?.message || " ")}
                    onChange={(value) =>
                      field.onChange(value.replace(/\s/g, "") || "")
                    }
                  />
                )}
              />
            )}
          </FormRow>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isRequesting}
            className="!bg-primary hover:!bg-primary-shade h-10 disabled:!bg-gray-400"
          >
            {t("Send OTP")}
          </Button>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetSubmit(handleReset)}>
          <FormRow>
            <TextField
              fullWidth
              size="small"
              label={t("OTP")}
              {...registerReset("otp", { required: t("OTP is required") })}
              error={!!resetErrors.otp}
              helperText={t(resetErrors.otp?.message || "")}
              className="mb-2"
            />
            <TextField
              size="small"
              label={t("New Password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...registerReset("newPassword")}
              error={!!resetErrors.newPassword}
              helperText={t(resetErrors.newPassword?.message || "")}
              autoComplete="new-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon className="text-gray-500" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <PasswordVisibility
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  ),
                  className: "bg-white",
                },
              }}
              fullWidth
            />
          </FormRow>

          {/* Row with Change method (left) and Resend OTP (right) */}
          <div className="flex items-center justify-between gap-2 text-sm">
            <span
              onClick={() => {
                setStep("request");
                setSessionId(null);
                setResendCooldown(0);
              }}
              className="text-primary cursor-pointer font-medium hover:underline"
            >
              {t("Change method")}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">
                {t("Didn’t you receive the OTP?")}
              </span>
              <span
                onClick={handleResendOtp}
                className={`cursor-pointer font-medium hover:underline ${
                  resendCooldown > 0 || isResending
                    ? "cursor-not-allowed text-gray-400"
                    : "text-primary"
                }`}
              >
                {resendCooldown > 0
                  ? t("Resend OTP ({{seconds}}s)", { seconds: resendCooldown })
                  : t("Resend OTP")}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="!bg-primary hover:!bg-primary-shade h-10 disabled:!bg-gray-400"
            disabled={isVerifying}
          >
            {t("Reset Password")}
          </Button>
        </form>
      )}

      <div className="mt-4 flex justify-center">
        <span
          onClick={onBackToLogin}
          className="text-primary cursor-pointer text-sm hover:underline"
        >
          {t("Back to Login")}
        </span>
      </div>
    </div>
  );
}
