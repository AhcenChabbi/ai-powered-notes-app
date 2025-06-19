import NextAuth from "next-auth";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
});
