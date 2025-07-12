"use server";
import { auth, signIn, signOut } from "../auth";
import { convertZodErrors } from "../errors";
import {
  loginSchema,
  signupSchema,
  TLoginSchema,
  TSignupSchema,
} from "../schemas/schemas";
import { FormState } from "../types/FormState";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
  const validatedCredentials = signupSchema.safeParse(rawData);
  if (!validatedCredentials.success) {
    return {
      data: rawData,
      errors: convertZodErrors(validatedCredentials.error),
    };
  }
  const { name, email, password } = validatedCredentials.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return {
      data: rawData,
      errors: { email: "Email already registered" },
    };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  if (!user) {
    return {
      data: rawData,
      errors: {
        root: "An error occurred while creating your account.",
      },
    };
  }
  await signIn("credentials", {
    ...validatedCredentials.data,
    redirect: false,
  });
  return {
    successMessage: "Signed up successfully",
    data: rawData,
  };
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
      redirect: false,
    });
    return {
      successMessage: "Signed in successfully",
      data: rawData,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            errors: {
              root: "Invalid credentials",
            },
            data: rawData,
          };
      }
    }
  }
  return {
    errors: {
      root: "An error occurred while logging in.",
    },
    data: rawData,
  };
}

export async function signInWithGoogle() {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
}
export async function handleSignOut() {
  await signOut({
    redirect: false,
  });
  return {
    successMessage: "Signed out successfully",
  };
}
export async function getUserNoteAction() {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    redirect("/login");
  }
  const userId = user.id;
  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      plainTextContent: true,
    },
  });
  return notes;
}
