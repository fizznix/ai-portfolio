import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FloatingBotWrapper from "@/components/FloatingBotWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nixon Kurian — AI Engineer",
  description:
    "Portfolio of Nixon Kurian — building intelligent systems, AI infrastructure, and developer tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased dark`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#0a0a0a] text-white" suppressHydrationWarning>
        {children}
        <FloatingBotWrapper />
      </body>
    </html>
  );
}
