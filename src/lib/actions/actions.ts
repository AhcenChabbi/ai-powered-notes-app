"use server";
import { signIn } from "../auth";
import { convertZodErrors } from "../errors";
import {
  loginSchema,
  signupSchema,
  TLoginSchema,
  TSignupSchema,
} from "../schemas/schemas";
import { FormState } from "../types/FormState";
import { executeAction } from "./executeAction";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";

const redirectTo = "/dashboard";

export async function signupAction(
  prevState: unknown,
  formData: FormData
): Promise<FormState<TSignupSchema>> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };
  try {
    const validatedCredentials = signupSchema.safeParse(rawData);
    if (!validatedCredentials.success) {
      return {
        data: rawData,
        errors: convertZodErrors(validatedCredentials.error),
      };
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedCredentials.data.email },
    });
    if (existingUser) {
      return {
        data: rawData,
        errors: { email: "Email already registered" },
      };
    }
    const hashedPassword = await bcrypt.hash(rawData.password, 10);
    await prisma.user.create({
      data: {
        name: rawData.name,
        email: rawData.email,
        password: hashedPassword,
      },
    });
    await signIn("credentials", {
      ...validatedCredentials.data,
      redirectTo,
    });
    return {
      successMessage: "Signed up successfully",
      data: rawData,
    };
  } catch (e) {
    return {
      data: rawData,
      errors: {
        root: "Something went wrong. Please try again.",
      },
    };
  }
}

export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<FormState<TLoginSchema>> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  try {
    const validatedCredentials = loginSchema.safeParse(rawData);
    if (!validatedCredentials.success) {
      return {
        data: rawData,
        errors: convertZodErrors(validatedCredentials.error),
      };
    }

    await signIn("credentials", {
      ...validatedCredentials.data,
      redirectTo,
    });
    return {
      successMessage: "Logged in successfully",
      data: rawData,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        data: rawData,
        errors: {
          root: "Invalid email or password.",
        },
      };
    }

    throw error;
  }
}

export async function handleSignInWithGoogle() {
  await executeAction({
    actionFn: async () => {
      await signIn("google", {
        redirectTo,
      });
    },
    errorMessage: "Something went wrong. Please try again.",
    successMessage: "Logged in successfully",
  });
}
