import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const BASE_URL = "https://www.milk.design";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Milk Design Studio — Strategy, Product & Brand Design",
    template: "%s | Milk Design Studio",
  },
  description:
    "Steven Cooper's practice for strategy, product design, and brand. Helping founders and operators find the real problem before committing to a solution.",
  keywords: [
    "milk design studio",
    "milk.design",
    "design studio",
    "product design",
    "brand strategy",
    "UX design",
    "service design",
    "design ops",
    "AI enablement",
    "startup design",
    "steven cooper designer",
  ],
  authors: [{ name: "Steven Cooper", url: BASE_URL }],
  creator: "Milk Design Studio",
  publisher: "Milk Design Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Milk Design Studio",
    title: "Milk Design Studio — Strategy, Product & Brand Design",
    description:
      "Design studio helping founders turn big ideas into world-class businesses. Strategy, product design, branding, and AI enablement.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Milk Design Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Milk Design Studio — Strategy, Product & Brand Design",
    description:
      "Design studio helping founders turn big ideas into world-class businesses.",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/FavIcon.png" },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Milk Design Studio",
    url: BASE_URL,
    logo: `${BASE_URL}/MilkLogo-Black.png`,
    description:
      "Steven Cooper's independent practice at the intersection of strategy, product, and brand. Working with founders and operators who want to build the right thing.",
    founder: { "@type": "Person", name: "Steven Cooper" },
    serviceType: [
      "Product Design",
      "Brand Strategy",
      "Service Design",
      "Design Ops",
      "AI Enablement",
      "Design Systems",
      "Market & User Research",
      "Business Model Design",
    ],
    sameAs: [
      "https://www.instagram.com/milkdotdesign/",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Steven Cooper",
    jobTitle: "Founder & Design Lead",
    url: `${BASE_URL}/about`,
    worksFor: {
      "@type": "Organization",
      name: "Milk Design Studio",
      url: BASE_URL,
    },
    sameAs: [
      "https://www.linkedin.com/in/steven-cooper-brenes/",
      "https://www.instagram.com/milkdotdesign/",
      "https://medium.com/@stevencooper_75268",
    ],
  },
];

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          {children}
        <Analytics />
</ClientWrapper>
      </body>
    </html>
  );
}
