import Nav from "@/app/components/Nav";
import HeroSection from "@/app/components/HeroSection";
import BioSection from "@/app/components/BioSection";
import ServicesSection from "@/app/components/ServicesSection";
import TeamSection from "@/app/components/TeamSection";
import MethodSection from "@/app/components/MethodSection";
import ProjectsSection from "@/app/components/ProjectsSection";
import TestimonialSection from "@/app/components/TestimonialSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="relative">
<Nav />
      <HeroSection />
      <TeamSection />
      <BioSection />
      <MethodSection />
      <ServicesSection />
      <TestimonialSection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
