import { generateVerificationToken } from "./generateVerificationToken";
import sendVerificationEmail from "./send-verification-email";

export default async function VerifyEmail(email: string) {
  try {
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
