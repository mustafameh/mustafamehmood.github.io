import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mustafa Mehmood — Applied Scientist",
  description:
    "Applied Scientist at Thomson Reuters: agentic system design, LLM evaluation and fine-tuning for high-stakes domains.",
  keywords: [
    "Applied Scientist",
    "LLM Agents",
    "Agentic Systems",
    "LLM Evaluation",
    "Fine-Tuning",
    "Machine Learning",
    "Mustafa Mehmood",
  ],
  openGraph: {
    title: "Mustafa Mehmood — Applied Scientist",
    description:
      "Designing, evaluating and fine-tuning agentic systems for high-stakes domains.",
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
        <Chatbot />
      </body>
    </html>
  );
}
