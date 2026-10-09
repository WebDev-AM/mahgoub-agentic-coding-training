import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField, InputAdornment } from "@mui/material";
import FormRow from "../../ui/FormRow";
import { t } from "i18next";
import { MuiTelInput } from "mui-tel-input";
import { FaUser as UserIcon, FaLock as PasswordIcon } from "react-icons/fa";
import { RegisterUserSchema, RegisterUserType } from "../../types/AuthSchema";
import { useRegisterUser } from "./useRegisterUser";
import { MdEmail as EmailIcon } from "react-icons/md";
import { motion } from "framer-motion";

import PasswordVisibility from "./PasswordVisibility";

type RegisterUserFormProps = {
  onRegister?: (sessionId: string, method: "sms" | "email") => void;
};

function RegisterUserForm({ onRegister }: RegisterUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterUserType>({
    resolver: zodResolver(RegisterUserSchema),
    mode: "onChange",
  });
  const { registerUser, isRegistering } = useRegisterUser();
  const isLoading = isRegistering;

  const onSubmit = async (data: RegisterUserType) => {
    try {
      const { sessionId } = await registerUser(data);
      onRegister?.(
        sessionId,
        data.deliveryMethod === "email" ? "email" : "sms"
      );
    } catch (error) {
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
      <FormRow>
        <TextField
          size="small"
          label={t("First Name")}
          placeholder={t("First Name")}
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={t(errors.firstName?.message || "")}
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
          className="flex-1"
        />
      </FormRow>

      <FormRow>
        <TextField
          size="small"
          label={t("Last Name")}
          placeholder={t("Last Name")}
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={t(errors.lastName?.message || "")}
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
          className="flex-1"
        />
      </FormRow>

      <FormRow>
        <TextField
          autoComplete="email"
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
                  <EmailIcon className="text-gray-500" />
                </InputAdornment>
              ),
              className: "bg-white",
            },
          }}
          className="flex-1"
        />
      </FormRow>

      <FormRow>
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
      </FormRow>

      <FormRow>
        <TextField
          size="small"
          label={t("Password")}
          type={showPassword ? "text" : "password"}
          placeholder={t("Password")}
          {...register("password")}
          error={!!errors.password}
          autoComplete="new-password" // prevent browser auto-fill
          helperText={t(errors.password?.message || "")}
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
          className="flex-1"
        />
      </FormRow>

      <div className="mb-2">
        <div className="flex flex-1 justify-between">
          <p className="text-sm text-gray-700">
            {t("How do you want to verify your account?")}
          </p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="email"
                {...register("deliveryMethod")}
              />
              <span>{t("Email")}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="phone"
                {...register("deliveryMethod")}
              />
              <span>{t("Phone")}</span>
            </label>
          </div>
        </div>
        {errors.deliveryMethod && (
          <p className="text-xs text-red-600">
            {t(errors.deliveryMethod.message || "")}
          </p>
        )}
      </div>
      <Button
        variant="contained"
        type="submit"
        disabled={isLoading}
        className="!bg-primary hover:!bg-primary-shade h-10 disabled:!bg-gray-400"
        fullWidth
      >
        {t("Register User")}
      </Button>
    </motion.form>
  );
}

export default RegisterUserForm;
