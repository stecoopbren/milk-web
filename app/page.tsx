import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import HeroSection from "@/app/components/HeroSection";
import PositioningSection from "@/app/components/PositioningSection";
import BioSection from "@/app/components/BioSection";
import ServicesSection from "@/app/components/ServicesSection";
import TeamSection from "@/app/components/TeamSection";
import MethodSection from "@/app/components/MethodSection";
import ProjectsSection from "@/app/components/ProjectsSection";
import TestimonialSection from "@/app/components/TestimonialSection";
import BlogSection from "@/app/components/BlogSection";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Milk Design Studio — Strategy, Product & Brand",
  description: "Milk helps founders and operators find the problem worth solving before touching the solution. Strategy, product design, and brand for ambitious companies.",
  alternates: { canonical: "https://www.milk.design" },
  openGraph: {
    type: "website",
    url: "https://www.milk.design",
    title: "Milk Design Studio — Strategy, Product & Brand",
    description: "Milk helps founders and operators find the problem worth solving before touching the solution. Strategy, product design, and brand for ambitious companies.",
    images: [{ url: "https://www.milk.design/og-image.png", width: 1200, height: 630, alt: "Milk Design Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Milk Design Studio — Strategy, Product & Brand",
    description: "Milk helps founders and operators find the problem worth solving before touching the solution.",
    images: ["https://www.milk.design/og-image.png"],
  },
};

export default function Home() {
  return (
    <main className="relative">
<Nav />
      <HeroSection />
      <PositioningSection />
      <TeamSection />
      <BioSection />
      <MethodSection />
      <ServicesSection />
      <TestimonialSection />
      <ProjectsSection />
      <BlogSection />
      <Footer />
    </main>
  );
}
