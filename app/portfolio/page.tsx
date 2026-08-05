import MilkBackground from "@/app/components/MilkBackground";
import Nav from "@/app/components/Nav";
import PortfolioHero from "@/app/components/PortfolioHero";
import Footer from "@/app/components/Footer";

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
