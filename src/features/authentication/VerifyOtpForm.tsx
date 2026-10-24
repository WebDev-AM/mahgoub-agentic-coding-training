import mobile from "../../assets/images/placeholder.svg";
import email from "../../assets/images/placeholder.svg";
import { useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { t } from "i18next";
import { useVerifyOtp } from "./useVerifyOtp";
import HeadingText from "../../ui/HeadingText";
import { useResendOtp } from "./useResendOtp";
import { useRef, useState, useEffect } from "react";

type VerifyOtpFormProps = {
  sessionId: string;
  method: "sms" | "email";
};

type FormValues = { otp: string };

export default function VerifyOtpForm({
  sessionId,
  method,
}: VerifyOtpFormProps) {
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  const { verifyOtp, isVerifying } = useVerifyOtp();
  const { resendOtp, isResending } = useResendOtp();
  const otpValue = watch("otp");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    resendOtp(sessionId);
    setResendCooldown(30);
  };

  const onSubmit = (data: FormValues) => {
    if (data.otp.length === 6) {
      verifyOtp({ sessionId, otp: data.otp }, { onError: () => reset() });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const otpArray = otpValue.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setValue("otp", newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.length === 6 && !newOtp.includes(" ")) {
      onSubmit({ otp: newOtp });
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row-reverse md:items-start">
      <div>
        <img src={method === "sms" ? mobile : email} alt="mobile image" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HeadingText className="text-primary !block">
          {t("OTP Verification")}
        </HeadingText>
        <p className="text-center text-xl font-light">
          {t(
            `Enter the OTP you received via ${method === "sms" ? "WhatsApp" : "email"}`
          )}
        </p>

        {/* OTP Input Boxes */}
        <div className="my-4 flex justify-center gap-2">
          {[...Array(6)].map((_, index) => (
            <TextField
              variant="standard"
              disabled={isVerifying}
              key={index}
              focused={otpValue.length > index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              slotProps={{
                htmlInput: {
                  maxLength: 1,
                  className:
                    "text-center !w-4 !h-4 md:!w-15 md:!h-15 md:!text-3xl",
                },
              }}
              value={otpValue[index] || ""}
              onChange={(e) =>
                handleOtpChange(index, e.target.value.replace(/\D/, ""))
              }
              error={!!errors.otp}
            />
          ))}
        </div>
        {errors.otp && (
          <p className="text-center text-sm text-red-500">
            {t(errors.otp.message || "")}
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
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
      </form>
    </div>
  );
}
