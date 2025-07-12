import LoginForm from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Notes - Login",
  description: "Sign in to your account to continue",
};

export default async function LoginPage() {
  return <LoginForm />;
}
