"use server";
import VerificationEmail from "@/components/verification-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export default async function sendVerificationEmail(
  email: string,
  token: string
) {
  await resend.emails.send({
    from: "AI Notes <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address for Ai Notes",
    react: VerificationEmail({ token }),
  });
}
