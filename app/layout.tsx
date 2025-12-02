import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Music Studio",
  description: "Create music and sounds with Wavespeed AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

