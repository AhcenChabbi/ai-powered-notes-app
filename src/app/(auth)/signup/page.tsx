import SignUpForm from "@/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Notes - Sign Up",
  description: "Create a new account to start using AI Notes",
};
export default async function SignUpPage() {
  return <SignUpForm />;
}
