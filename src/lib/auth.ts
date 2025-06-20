import NextAuth from "next-auth";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./schemas/schemas";
import bcrypt from "bcrypt";
import Google from "next-auth/providers/google";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
const adapter = PrismaAdapter(prisma);
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
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
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
