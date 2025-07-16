import type { NextAuthConfig } from "next-auth";
import * as bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginSchema } from "./lib/schemas/schemas";
import getUserByEmail from "./lib/utils/getUserByEmail";
export default {
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = loginSchema.parse(credentials);
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          createdAt: user.createdAt.toString(),
          emailVerified: user.emailVerified?.toString() || null,
          updatedAt: user.updatedAt.toString(),
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
