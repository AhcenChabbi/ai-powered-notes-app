import MissingTokenQueryParam from "@/app/verify-email/missing-token-query-param";
import verificationEmailAction from "@/lib/actions/actions";
import InvalidToken from "./invalid-token";
import ExpiredToken from "./expired-token";
import SuccessState from "./success-state";
import { type Metadata } from "next";

type Props = {
  searchParams: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "AI Notes - Verify Email",
  description: "Email verification for AI Notes",
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) return <MissingTokenQueryParam />;
  const res = await verificationEmailAction(token);
  switch (res.state) {
    case "invalid":
      return <InvalidToken />;
    case "expired":
      return <ExpiredToken />;
    case "success":
      return <SuccessState />;
  }
}
