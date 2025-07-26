import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootProviders from "@/providers/root-providers";
import { getBaseUrl } from "@/lib/utils/get-base-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Notes - Smart Note-Taking App",
  description:
    "Organize, summarize, and understand your notes like never before with AI",
  openGraph: {
    title: "AI Notes - Smart Note-Taking App",
    description:
      "Organize, summarize, and understand your notes like never before with AI",
    url: getBaseUrl(),
    siteName: "AI Notes",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    title: "AI Notes - Smart Note-Taking App",
    description:
      "Organize, summarize, and understand your notes like never before with AI",
    card: "summary_large_image",
  },
  keywords: ["ai", "notes", "ai notes"],
  metadataBase: new URL(getBaseUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootProviders> {children}</RootProviders>
      </body>
    </html>
  );
}
