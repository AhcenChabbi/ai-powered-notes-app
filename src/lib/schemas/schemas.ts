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
