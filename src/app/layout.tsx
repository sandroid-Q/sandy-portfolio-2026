import type { Metadata } from "next";
import { Silkscreen, Space_Grotesk, Space_Mono } from "next/font/google";
import { AudioProvider } from "@/contexts/AudioContext";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const silkscreen = Silkscreen({
  weight: ["400"],
  variable: "--font-silkscreen",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sandy Qi — Portfolio",
  description: "Senior Product Designer based in Sydney",
};

// Runs before first paint so a light choice made earlier in this tab session is
// applied without a flash of the default dark theme. Scope is sessionStorage on
// purpose: a brand-new tab starts dark. Only an explicit "light" is honoured —
// the default (and anything else) stays dark; the device's prefers-color-scheme
// is intentionally ignored.
const themeInitScript = `(function(){try{if(sessionStorage.getItem("theme")==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AudioProvider>
          <CustomCursor />
          {children}
          <LoadingScreen />
        </AudioProvider>
        {/* Cookieless, privacy-friendly analytics (visitors, page views, device,
            country, referrers) + Core Web Vitals. Only collects in production
            once Analytics is enabled in the Vercel project dashboard. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
