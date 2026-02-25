import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OH Frontend – Dashboard",
  description: "Minimal MVP for engagement, quiz, and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
