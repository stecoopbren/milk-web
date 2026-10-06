import MilkBackground from "@/app/components/MilkBackground";
import Nav from "@/app/components/Nav";
import PortfolioHero from "@/app/components/PortfolioHero";
import Footer from "@/app/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Case studies from Milk Design Studio — brand strategy, product design, and digital transformation work for ambitious founders and teams.",
  alternates: { canonical: "https://www.milk.design/portfolio" },
  openGraph: {
    type: "website",
    url: "https://www.milk.design/portfolio",
    title: "Portfolio — Milk Design Studio",
    description:
      "Case studies from Milk Design Studio — brand strategy, product design, and digital transformation work for ambitious founders and teams.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Milk Design Studio Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Milk Design Studio",
    description:
      "Case studies from Milk Design Studio — brand strategy, product design, and digital transformation work for ambitious founders and teams.",
    images: ["/opengraph-image"],
  },
};

export default function Portfolio() {
  return (
    <main className="relative">
      <MilkBackground />
      <div className="relative z-10">
        <Nav />
        <PortfolioHero />
        <Footer />
      </div>
    </main>
  );
}
