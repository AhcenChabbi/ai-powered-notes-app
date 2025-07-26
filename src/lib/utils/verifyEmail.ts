"use server";
import { request } from "@arcjet/next";
import { generateVerificationToken } from "./generateVerificationToken";
import sendVerificationEmail from "./send-verification-email";
import { verifyEmailArcjet } from "../security/verifyEmailArcjet";

export default async function VerifyEmail(email: string) {
  try {
    const req = await request();
    const decision = await verifyEmailArcjet.protect(req, { requested: 1 });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          success: false,
          message: "Too Many Requests",
        };
      } else if (decision.reason.isBot()) {
        return {
          success: false,
          message: "Bot Detected",
        };
      } else if (decision.reason.isShield()) {
        return {
          success: false,
          message:
            "Your request was blocked by our security system for unusual activity.",
        };
      }
      return {
        success: false,
        message: "Failed to send verification email, please try again",
      };
    }
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (_error) {
    return {
      success: false,
      message: "Failed to send verification email, please try again",
    };
  }
}
