import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import ScrollSnapController from "./components/ScrollSnapController";
import ClientWrapper from "./components/ClientWrapper";
import ScrollCue from "./components/ScrollCue";
import CursorDotTrail from "./components/CursorDotTrail";
import LiquidBackground from "./components/LiquidBackground";
import BackToTop from "./components/BackToTop";
import ScrollProgressBar from "./components/ScrollProgressBar";
import LenisProvider from "./components/LenisProvider";
import FilmGrain from "./components/FilmGrain";
import IntroLoader from "./components/IntroLoader";
import NowPlaying from "./components/NowPlaying";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Milk Design Studio",
  description: "We turn big ideas into thriving businesses.",
  icons: { icon: "/FavIcon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmMono.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/vrt1zjw.css" />
      </head>
      <body>
        <ClientWrapper>
          <IntroLoader />
          <LenisProvider />
          <FilmGrain />
          <ScrollProgressBar />
          <LiquidBackground />
          <CursorDotTrail />
          <ScrollSnapController />
          <ScrollCue />
          <BackToTop />
          <NowPlaying />
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
