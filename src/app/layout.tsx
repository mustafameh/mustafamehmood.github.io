import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mustafa Mehmood — Applied AI Scientist",
  description:
    "Applied AI Scientist building intelligent systems where precision meets real-world impact. Currently at Thomson Reuters.",
  keywords: [
    "AI",
    "Machine Learning",
    "LLM",
    "Computer Vision",
    "Applied Scientist",
    "Mustafa Mehmood",
  ],
  openGraph: {
    title: "Mustafa Mehmood — Applied AI Scientist",
    description:
      "Building intelligent systems where precision meets real-world impact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${dmSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
