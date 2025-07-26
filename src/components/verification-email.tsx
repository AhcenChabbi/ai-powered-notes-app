import { getBaseUrl } from "@/lib/utils/get-base-url";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface VerificationEmailProps {
  token: string;
}

export const VerificationEmail = ({ token }: VerificationEmailProps) => {
  const verificationLink = `${getBaseUrl()}/verify-email?token=${token}`;
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Ai Notes</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white mx-auto py-5 pb-12 mb-16">
            <Section className="px-8 pt-8">
              <Heading className="text-2xl font-bold text-gray-700 text-center mb-8">
                🤖 Ai Notes
              </Heading>
            </Section>

            <Section className="px-8">
              <Heading className="text-gray-900 text-2xl font-bold text-center my-10">
                Verify your email address
              </Heading>

              <Text className="text-gray-900 text-base leading-relaxed my-4">
                Thanks for joining Ai Notes! To get access to all the features
                of our AI-powered note-taking platform, please verify your email
                address by clicking the button below.
              </Text>

              <Section className="text-center my-8">
                <Button
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded text-base no-underline inline-block max-w-xs"
                  href={verificationLink}
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-gray-900 text-base leading-relaxed my-4">
                If the button doesn&apos;t work, you can also copy and paste
                this link into your browser:
              </Text>

              <Text className="text-gray-900 text-sm leading-6 my-4 p-4 bg-gray-50 rounded border border-gray-200 break-all">
                <Link
                  href={verificationLink}
                  className="text-blue-600 no-underline"
                >
                  {verificationLink}
                </Link>
              </Text>

              <Text className="text-gray-600 text-sm leading-6 my-4">
                This verification link will expire in 2 hours for security
                purposes.
              </Text>
            </Section>

            <Section className="border-t border-gray-200 px-8 pt-8 mt-10">
              <Text className="text-gray-600 text-xs leading-4 my-2 text-center">
                © 2025 Ai Notes. All rights reserved.
              </Text>
              <Text className="text-gray-600 text-xs leading-4 my-2 text-center">
                Questions? Contact us at support@ai-notes.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
