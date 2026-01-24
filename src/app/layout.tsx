import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asteroids Clone - Space Defender",
  description: "An Asteroids clone with mouse aiming built with Phaser 3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
