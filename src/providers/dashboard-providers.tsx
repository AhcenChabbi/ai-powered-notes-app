"use client";
import queryClient from "@/config/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Session, User } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

type Props = {
  children: React.ReactNode;
  session: Session;
  user: User;
};
export default function DashboardProviders({ children, session, user }: Props) {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session} key={user.id}>
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
