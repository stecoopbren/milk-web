import MilkBackground from "@/app/components/MilkBackground";
import Nav from "@/app/components/Nav";
import HeroSection from "@/app/components/HeroSection";
import StatementSection from "@/app/components/StatementSection";
import MethodSection from "@/app/components/MethodSection";
import ProjectsSection from "@/app/components/ProjectsSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <MilkBackground />
      <div className="relative z-10">
        <Nav />
        <HeroSection />
        <StatementSection />
        <MethodSection />
        <ProjectsSection />
        <Footer />
      </div>
    </main>
  );
}
