import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MADA SHOP — Marketplace Madagascar",
  description: "Marketplace moderne pour acheter et vendre à Madagascar"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}