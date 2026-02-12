import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import LoginOverlayGate from "@/app/components/LoginOverlayGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CrowdQuiz",
  description: "Challenge yourself with quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="clckd" content="d0cdf235bb0801cf330287fe87131972" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LoginOverlayGate />
          {children}
        </AuthProvider>
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "0acbd654a47348e599bc9016da8e0241"}'
          strategy="afterInteractive"
        />
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7321285556879956"
          strategy="afterInteractive"
          async
        />
      </body>
    </html>
  );
}
