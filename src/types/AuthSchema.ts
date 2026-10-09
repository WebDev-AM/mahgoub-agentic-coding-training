import { z } from "zod";

// Common phone number regexes
// const kuwaitPhoneRegex = /^(\+965|965|00965|0965)[569]\d{7}$/;
// const egyptPhoneRegex = /^(\+201|01|00201|0201|201|1)[0125]\d{8}$/;

export type UserDetails = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  profileImage: string;
};

export const UpdateUserSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

// Register schema (previously CreateUserSchema)
export const RegisterUserSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  firstName: z
    .string()
    .min(3, { message: "First name must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be at least 3 characters" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  deliveryMethod: z.enum(["email", "phone"], {
    invalid_type_error:
      "Select a contact method (email or phone number) to receive your OTP",
    required_error: "Please select a delivery method",
  }),
});

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;

// Login schema
export const LoginSchema = z
  .object({
    email: z
      .union([
        z.string().email({ message: "Invalid email format" }),
        z.literal(""),
        z.undefined(),
      ])
      .optional(),
    phoneNumber: z.string().optional(),

    password: z.string().min(1, { message: "Password is required" }),
  })
  .refine((data) => !!data.email || !!data.phoneNumber, {
    message: "Please provide either an email or phone number",
    path: ["email", "phoneNumber"],
  });

export type LoginType = z.infer<typeof LoginSchema>;

export const RequestPasswordResetSchema = z
  .object({
    email: z
      .union([
        z.string().email({ message: "Invalid email format" }),
        z.literal(""),
        z.undefined(),
      ])
      .optional(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => !!data.email || !!data.phoneNumber, {
    message: "Please provide either an email or phone number",
    path: ["email", "phoneNumber"],
  });

export type RequestPasswordResetType = z.infer<
  typeof RequestPasswordResetSchema
>;

export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  otp: z.string().min(6, { message: "OTP must be 6 characters" }).max(6, {
    message: "OTP must be 6 characters",
  }),
});

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;
