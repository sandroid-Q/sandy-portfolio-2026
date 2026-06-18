import type { Metadata } from "next";
import { Silkscreen, Space_Grotesk, Space_Mono } from "next/font/google";
import { AudioProvider } from "@/contexts/AudioContext";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
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

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
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
      className={`${silkscreen.variable} ${spaceGrotesk.variable} ${spaceMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <AudioProvider>
          <CustomCursor />
          {children}
          <LoadingScreen />
        </AudioProvider>
      </body>
    </html>
  );
}
