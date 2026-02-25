import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DOOZZON Q",
  description: "Minimal MVP for engagement, quiz, and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
