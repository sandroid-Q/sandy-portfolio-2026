import type { Metadata } from "next";
import { Silkscreen, Space_Grotesk } from "next/font/google";
import "./globals.css";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  variable: "--font-silkscreen",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandy Qi — Portfolio",
  description: "Senior Product Designer based in Sydney",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${silkscreen.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
