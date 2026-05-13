import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Barlow,
  Geist,
  Geist_Mono,
  Libre_Franklin,
  Lora,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const cloisterBlack = localFont({
  src: "./fonts/CloisterBlack.ttf",
  variable: "--font-cloister-black",
});

const arnoPro = localFont({
  src: [
    { path: "./fonts/arnopro_caption.otf", weight: "400", style: "normal" },
    { path: "./fonts/arnopro_bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/arnopro_bolditalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-arno-pro",
});

const arnoProCaption = localFont({
  src: [
    { path: "./fonts/arnopro_caption.otf", weight: "400", style: "normal" },
    { path: "./fonts/arnopro_boldcaption.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-arno-pro-caption",
});

const arnoProDisplay = localFont({
  src: "./fonts/arnopro_bolddisplay.otf",
  variable: "--font-arno-pro-display",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Article Generator",
  description: "Dynamic newspaper article editor and PNG exporter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${libreFranklin.variable} ${playfairDisplay.variable} ${lora.variable} ${barlow.variable} ${cloisterBlack.variable} ${arnoPro.variable} ${arnoProCaption.variable} ${arnoProDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
