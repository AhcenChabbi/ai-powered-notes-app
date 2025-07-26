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
import * as bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { request } from "@arcjet/next";
import { signUpArcjet } from "../security/signupArcjet";
import { loginArcjet } from "../security/loginArcjet";

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
  const req = await request();
  const decision = await signUpArcjet.protect(req, {
    email: rawData.email,
    requested: 1,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return {
        data: rawData,
        errors: { root: "Too Many Requests" },
      };
    }
    if (decision.reason.isBot()) {
      return {
        data: rawData,
        errors: { root: "Bot Detected" },
      };
    }
    if (decision.reason.isEmail()) {
      let message = "Invalid email address";
      if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Invalid email address.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "No MX records found for email address.";
      }
      return {
        data: rawData,
        errors: { email: message },
      };
    }
    if (decision.reason.isShield()) {
      return {
        data: rawData,
        errors: {
          root: "Your request was blocked by our security system for unusual activity.d",
        },
      };
    }
    return {
      data: rawData,
      errors: { root: "An error occurred while creating your account." },
    };
  }

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
  const req = await request();
  const decision = await loginArcjet.protect(req, {
    requested: 1,
  });
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return {
        data: rawData,
        errors: { root: "Too Many Requests" },
      };
    } else if (decision.reason.isShield()) {
      return {
        data: rawData,
        errors: {
          root: "Your request was blocked by our security system for unusual activity.d",
        },
      };
    } else if (decision.reason.isBot()) {
      return {
        data: rawData,
        errors: { root: "Bot Detected" },
      };
    }
    return {
      data: rawData,
      errors: { root: "An error occurred while logging in." },
    };
  }

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
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            errors: {
              root: "Invalid credentials",
            },
            data: rawData,
          };
        default:
          return {
            errors: {
              root: "An error occurred while logging in.",
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

export default async function verificationEmailAction(token: string): Promise<{
  state: "success" | "invalid" | "expired";
  message: string;
}> {
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });
  if (!verificationToken) {
    return {
      state: "invalid",
      message: "Invalid token",
    };
  }
  const isExpired = verificationToken.expires.getTime() < Date.now();
  if (isExpired) {
    return {
      state: "expired",
      message: "Token expired",
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email: verificationToken.identifier,
    },
  });
  if (!user) {
    return {
      state: "invalid",
      message: "User not found",
    };
  }
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: new Date(),
    },
  });
  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      },
    },
  });
  return {
    state: "success",
    message: "Email verified successfully",
  };
}
