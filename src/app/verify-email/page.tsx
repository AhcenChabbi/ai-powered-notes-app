import MissingTokenQueryParam from "@/app/verify-email/missing-token-query-param";
import verificationEmailAction from "@/lib/actions/actions";
import InvalidToken from "./invalid-token";
import ExpiredToken from "./expired-token";
import SuccessState from "./success-state";

type Props = {
  searchParams: Promise<{ token: string }>;
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
