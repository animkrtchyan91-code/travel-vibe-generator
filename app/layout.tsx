import type { Metadata, Viewport } from "next";
import { Playfair_Display, EB_Garamond, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-playfair-display",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-eb-garamond",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "TRAVEL VIBE GENERATOR",
  description: "AI-powered hyper-specific travel plans. Built with Claude × HUVA.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TRAVEL VIBE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${ebGaramond.variable} ${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-dvh font-sans bg-midnight text-canvas antialiased">
        {children}
      </body>
    </html>
  );
}
