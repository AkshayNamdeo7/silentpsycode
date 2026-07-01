import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Silent Psycode Marketplace",
    template: "%s | Silent Psycode",
  },
  description: "A polished student-first marketplace for discovering and selling second-hand books with secure browsing and simple publishing flows.",
  metadataBase: new URL("https://silentpsycode.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Silent Psycode Marketplace",
    description: "Browse quality second-hand books, publish your own listings, and connect with student sellers effortlessly.",
    type: "website",
    siteName: "Silent Psycode",
  },
  twitter: {
    card: "summary_large_image",
    title: "Silent Psycode Marketplace",
    description: "Browse quality second-hand books, publish your own listings, and connect with student sellers effortlessly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
