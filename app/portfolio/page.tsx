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
