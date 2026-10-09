import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField, InputAdornment } from "@mui/material";
import FormRow from "../../ui/FormRow";
import { t } from "i18next";
import { MuiTelInput } from "mui-tel-input";
import { LoginSchema, LoginType } from "../../types/AuthSchema";
import { FaUser as UserIcon, FaLock as PasswordIcon } from "react-icons/fa";
import { useLogin } from "./useLogin";
import PasswordVisibility from "./PasswordVisibility";
import { useState } from "react";
import { motion } from "framer-motion";

type LoginFormProps = {
  onLogin?: (sessionId: string, method: "sms" | "email") => void;
  onForgotPassword?: () => void;
};
function LoginForm({ onLogin, onForgotPassword }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState<"email" | "phone">("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      email: "",
      phoneNumber: "",
    },
  });

  const { loginUser, isLogging } = useLogin();

  const onSubmit = async (data: LoginType) => {
    try {
      const optionalSessionId = await loginUser(data);
      if (optionalSessionId)
        onLogin?.(
          optionalSessionId.sessionId,
          type === "email" ? "email" : "sms"
        );
    } catch (error) {
      // Optional: show an error toast here
      console.error("Registration failed", error);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0.2, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-secondary-dark mb-4 flex h-9 flex-shrink-0 overflow-hidden rounded-lg border-2">
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
            {...register("email")}
            error={!!errors.email}
            helperText={t(errors.email?.message || "")}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon className="text-gray-500" />
                  </InputAdornment>
                ),
                className: "bg-white",
              },
            }}
            fullWidth
          />
        ) : (
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <MuiTelInput
                size="small"
                fullWidth
                dir="ltr"
                defaultCountry="KW"
                value={field.value || ""}
                error={!!errors.phoneNumber}
                helperText={t(errors.phoneNumber?.message || " ")}
                onChange={(value) =>
                  field.onChange(value.replace(/\s/g, "") || "")
                }
              />
            )}
          />
        )}
      </FormRow>

      <FormRow>
        <TextField
          size="small"
          label={t("Password")}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          {...register("password")}
          error={!!errors.password}
          helperText={t(errors.password?.message || "")}
          autoComplete="new-password" // prevent browser auto-fill
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
      <div className="relative z-10 mt-[-20px] mb-2 flex justify-end">
        <span
          onClick={() => onForgotPassword?.()} // Call the handler
          className="text-primary cursor-pointer text-sm hover:underline"
        >
          {t("Forgot Password?")}
        </span>
      </div>
      <Button
        variant="contained"
        type="submit"
        disabled={isLogging}
        className="!bg-primary hover:!bg-primary-shade h-10 disabled:!bg-gray-400"
        fullWidth
      >
        {t("Login")}
      </Button>
    </motion.form>
  );
}

export default LoginForm;
