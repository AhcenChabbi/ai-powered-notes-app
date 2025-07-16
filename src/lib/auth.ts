import NextAuth from "next-auth";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { encode as defaultEncode } from "next-auth/jwt";
import { v4 as uuid } from "uuid";
import authConfig from "@/auth.config";
const adapter = PrismaAdapter(prisma);
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  ...authConfig,
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
  events: {
    linkAccount: async ({ user, account }) => {
      const trustedProviders = ["google", "github"];
      if (trustedProviders.includes(account?.provider)) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: new Date(),
          },
        });
      }
    },
  },
});
