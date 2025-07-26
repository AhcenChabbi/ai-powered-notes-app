import SignUpForm from "@/components/signup-form";
import { getBaseUrl } from "@/lib/utils/get-base-url";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Notes - Sign Up",
  description: "Create a new account to start using AI Notes",
  openGraph: {
    title: "AI Notes - Sign Up",
    description: "Create a new account to start using AI Notes",
    url: `${getBaseUrl()}/signup`,
    siteName: "AI Notes",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "AI Notes - Sign Up",
    description: "Create a new account to start using AI Notes",
    card: "summary_large_image",
  },
  metadataBase: new URL(getBaseUrl()),
};
export default async function SignUpPage() {
  return <SignUpForm />;
}
