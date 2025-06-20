import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(64, { message: "Password must be at most 64 characters long" });

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});
export type TLoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(64, { message: "Name must be at most 64 characters long" }),
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type TSignupSchema = z.infer<typeof signupSchema>;
