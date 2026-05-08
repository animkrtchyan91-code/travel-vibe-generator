import type { Metadata, Viewport } from "next";
import { Playfair_Display, EB_Garamond, Barlow, Barlow_Condensed, Instrument_Serif, Space_Mono } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-playfair-display",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "TRAVEL VIBE GENERATOR",
  description: "Hyper-specific travel plans, verified by AI. Built with Claude × HUVA.",
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
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${ebGaramond.variable} ${barlow.variable} ${barlowCondensed.variable} ${instrumentSerif.variable} ${spaceMono.variable}`}>
      <body className="min-h-dvh font-sans bg-midnight text-canvas antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
