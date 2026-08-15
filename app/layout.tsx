import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ETFC - Ethio Fighters Champion",
    template: "%s | ETFC",
  },
  description:
    "Ethiopian Fighting Championship — ADWA FIGHT NIGHT. MMA, Boxing & Muay Thai at the Adwa 00 Museum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-deep font-sans text-pure antialiased">
        {children}
      </body>
    </html>
  );
}
