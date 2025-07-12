import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(64, { message: "Password must be at most 64 characters long" })
  .trim();
const nameSchema = z
  .string()
  .min(1, { message: "Name is required" })
  .max(64, { message: "Name must be at most 64 characters long" })
  .trim();
const emailSchema = z
  .string()
  .email({ message: "Invalid email address" })
  .trim();
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type TLoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type TSignupSchema = z.infer<typeof signupSchema>;

export const tagsSchema = z.array(
  z.object({
    id: z.string(),
    name: z
      .string()
      .min(1, { message: "Tag name is required" })
      .max(64, { message: "Tag name must be at most 64 characters long" }),
    color: z.string().min(1, { message: "Tag color is required" }),
  })
);

export const noteSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(64, { message: "Title must be at most 64 characters long" }),
  content: z.string().min(1, { message: "Content is required" }),
  summary: z.string().optional(),
  isPinned: z.boolean(),
  isFavorite: z.boolean(),
  tags: tagsSchema,
});

export type TNoteSchema = z.infer<typeof noteSchema>;

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Tag name is required" })
    .max(20, { message: "Tag name must be at most 20 characters long" }),
  color: z.string().min(1, { message: "Tag color is required" }),
});

export const personalInfoSchema = z.object({
  name: nameSchema,
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size < 4.5 * 1024 * 1024,
      "Image size must be less than 4.5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Image type must be jpeg, png or webp"
    )
    .nullable(),
});

export type TPersonalInfoSchema = z.infer<typeof personalInfoSchema>;
