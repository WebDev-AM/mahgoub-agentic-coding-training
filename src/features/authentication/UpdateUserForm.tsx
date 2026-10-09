import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button, TextField, InputAdornment } from "@mui/material";
import { t } from "i18next";
import { MuiTelInput } from "mui-tel-input";
import { FaUser as UserIcon } from "react-icons/fa";
import { motion } from "framer-motion";

import FormRow from "../../ui/FormRow";
import {
  UpdateUserSchema,
  UpdateUserType,
  UserDetails,
} from "../../types/AuthSchema";
import { useUpdateUser } from "./useUpdateUser";
import { MdEmail } from "react-icons/md";

type UpdateUserFormProps = {
  userToEdit: UserDetails;
  onCloseModal?: () => void;
};

function UpdateUserForm({ userToEdit, onCloseModal }: UpdateUserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UpdateUserType>({
    resolver: zodResolver(UpdateUserSchema),
    mode: "onChange",
    defaultValues: userToEdit,
  });

  const { updateUser, isUpdating } = useUpdateUser();

  const onSubmit = (data: UpdateUserType) => {
    updateUser(data, {
      onSuccess: () => {
        onCloseModal?.();
      },
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0.2, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-w-65 rounded-lg md:min-w-180"
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
          size="small"
          label={t("Email")}
          disabled
          value={userToEdit.email}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail className="text-gray-500" />
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

      <Button
        variant="contained"
        type="submit"
        disabled={isUpdating}
        className="!bg-primary hover:!bg-primary-shade h-10 disabled:!bg-gray-400"
        fullWidth
      >
        {t("Update User")}
      </Button>
    </motion.form>
  );
}

export default UpdateUserForm;
