import LoginForm from "@/components/login-form";
import { getBaseUrl } from "@/lib/utils/get-base-url";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Notes - Login",
  description: "Sign in to your account to continue",
  openGraph: {
    title: "AI Notes - Login",
    description: "Sign in to your account to continue",
    url: `${getBaseUrl()}/login`,
    siteName: "AI Notes",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "AI Notes - Login",
    description: "Sign in to your account to continue",
    card: "summary_large_image",
  },
  metadataBase: new URL(getBaseUrl()),
};

export default async function LoginPage() {
  return <LoginForm />;
}
