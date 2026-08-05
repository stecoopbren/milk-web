"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


type OrbitItem = {
  title: string;
  role: string;
  year: string;
  image: string;
  images?: string[];
  staticImage?: string;
  href: string;
  tag: string;
};

// ── Project data (kept for PortfolioHero / other consumers) ──────────────────
export type Project = {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  img: string;
  tall?: boolean;
  hidden?: boolean;
};

export const projects: Project[] = [
  {
    id: 0,
    slug: "regenerative-community",
    category: "Real estate project",
    title: "Turning raw land into a $2M investment story.",
    description: "Full community master plan delivered in 10 weeks.",
    img: "/Chaguite/chaguite-hero.webp",
  },
  {
    id: 1,
    slug: "casa-siwa",
    category: "Brand & digital experience",
    title: "Turning a luxury retreat into a narrative people want to belong to.",
    description: "Brand strategy, digital experience, and editorial art direction.",
    img: "/Siwa/siwa-hero-wide.webp",
  },
  {
    id: 2,
    slug: "gxm",
    category: "Product strategy & transformation",
    title: "Two failed builds. One approach that worked.",
    description: "$2M secured. Evidence-first. Product shipped on the third attempt.",
    img: "/GXM/IMG_9702.jpg",
  },
  {
    id: 3,
    slug: "gxm-building-alignment-before-software",
    category: "Product strategy & transformation",
    title: "Building alignment before software.",
    description: "$2M secured. Product shipped after multiple failed attempts.",
    img: "/GXM/gxm-workshop.png",
    hidden: true,
  },
  {
    id: 4,
    slug: "gxm-validate-before-you-build",
    category: "Product strategy & transformation",
    title: "From hypothesis to evidence.",
    description: "12 interviews, full audit, competitive analysis. Build decision backed by evidence.",
    img: "/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png",
    hidden: true,
  },
  {
    id: 4,
    slug: "product-launch",
    category: "Product design",
    title: "Crafting a seamless digital product from zero to launch.",
    description: "Zero to launch in 8 weeks.",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    slug: "brand-system",
    category: "Brand system",
    title: "A unified brand system for a global SaaS platform.",
    description: "End-to-end identity delivered in six weeks.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    slug: "service-redesign",
    category: "Service design",
    title: "Reducing friction in a critical government service.",
    description: "Research to redesign in twelve weeks.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    slug: "ai-interface",
    category: "AI product",
    title: "Designing the interface for an AI-powered analytics tool.",
    description: "From zero to beta in ten weeks.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  },
];

// Orbit-ready items
const orbitItems: OrbitItem[] = [
  {
    title: "Regenerative Community", role: "Growth & Brand Lead", year: "2026",
    image: "/Chaguite/chaguite-hero.webp", staticImage: "/Chaguite/card-cover.webp",
    href: "/cases/regenerative-community", tag: "Real Estate",
  },
  {
    title: "Casa Siwä", role: "Brand & Experience Lead", year: "2025",
    image: "/Siwa/siwa-hero.webp", staticImage: "/Siwa/siwa-stone-hero.webp",
    href: "/cases/casa-siwa", tag: "Hospitality",
  },
  {
    title: "Digital Transformation", role: "Product Strategy & Design Lead", year: "2024",
    image: "/GXM/IMG_9702.jpg",
    images: [
      "/GXM/IMG_9702.jpg",
      "/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png",
      "/GXM/IMG_9702-2.jpg",
      "/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png",
      "/GXM/IMG_9711.jpg",
      "/GXM/gxm-workshop.png",
      "/GXM/Case 2/Assesment.png",
      "/GXM/gxm-journey-map.png",
      "/GXM/Case 2/assesment 2.png",
      "/GXM/gxm-programs.png",
      "/GXM/Case 2/Screenshot 2024-03-28 at 9.34.18 AM.png",
      "/GXM/gxm-scope-definition.png",
      "/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png",
      "/GXM/gxm-data-structure.png",
      "/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png",
      "/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png",
    ],
    href: "/cases/gxm", tag: "Enterprise SaaS",
  },
  {
    title: "Gov. Service Redesign", role: "Service Designer", year: "2023",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    href: "/cases/service-redesign", tag: "Service Design",
  },
  {
    title: "AI Analytics Interface", role: "Product Designer", year: "2025",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    href: "/cases/ai-interface", tag: "AI Product",
  },
];

// ProjectCard kept for PortfolioHero
export function ProjectCard({ project }: { project: Project; flipDelay?: number; inView?: boolean }) {
  return (
    <a href={`/cases/${project.slug}`} className="block w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
      <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
    </a>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ── Desktop: orbit carousel ────────────────────────────────────────────────────
function DesktopOrbit() {
  const total = orbitItems.length;
  const [active, setActive] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const go = (dir: number) => setActive((prev) => ((prev + dir) % total + total) % total);

  // Reset slide when active card changes
  useEffect(() => {
    setSlideIndex(0);
  }, [active]);

  // Cycle through images for active GXM cards
  useEffect(() => {
    const activeItem = orbitItems[active];
    if (!activeItem.images || activeItem.images.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % activeItem.images!.length);
    }, 500);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <div
      id="portfolio"
      className="snap-section hidden lg:flex flex-col"
      style={{ height: "100vh", paddingTop: 80, paddingBottom: 36 }}
    >
      {/* Inner: centers the whole block (heading + cards + controls) vertically */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

      {/* Heading — exactly 24px above the cards */}
      <h2
        className="font-sans font-medium text-[#0C0C12] text-center shrink-0"
        style={{ fontSize: "clamp(52px, 7vw, 88px)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: 24 }}
      >
        Featured Work
      </h2>

      {/* Orbit stage — fixed height so centering is predictable */}
      <div className="relative overflow-hidden flex items-center justify-center" style={{ height: "58vh" }}>
        {orbitItems.map((item, i) => {
          let offset = i - active;
          if (offset > total / 2)  offset -= total;
          if (offset < -total / 2) offset += total;
          const abs = Math.abs(offset);
          if (abs > 1) return null;
          const isActive = offset === 0;

          return (
            <motion.div
              key={item.href}
              className="absolute top-0 bottom-0 flex items-center"
              style={{ left: "50%" }}
              animate={{
                x: `calc(-50% + ${offset * 520}px)`,
                scale: isActive ? 1 : 1 - abs * 0.16,
                opacity: 1,
                zIndex: 10 - abs,
              }}
              transition={{ duration: 0.55, ease }}
              onClick={() => !isActive && setActive(i)}
            >
              <motion.a
                href={isActive ? item.href : undefined}
                onClick={(e) => !isActive && e.preventDefault()}
                data-dark="true"
                variants={{
                  idle:  { scale: 1 },
                  hover: { scale: 1.025 },
                }}
                initial="idle"
                whileHover={isActive ? "hover" : "idle"}
                transition={{ duration: 0.35, ease }}
                style={{
                  display: "block",
                  height: isActive ? "96%" : "84%",
                  width: isActive ? "clamp(580px, 54vw, 860px)" : undefined,
                  aspectRatio: isActive ? undefined : "3/4",
                  borderRadius: 20,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <img
                  src={isActive
                    ? (item.images ? item.images[slideIndex] : item.image)
                    : (item.staticImage ?? item.image)}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />

                {/* Dark scrim on non-active cards */}
                {!isActive && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", transition: "opacity 0.4s ease" }} />
                )}

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.72) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, letterSpacing: "-0.3px", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
                            {item.tag} · {item.year}
                          </p>
                          <p style={{ color: "#fff", fontSize: 20, fontWeight: 600, letterSpacing: "-0.8px", lineHeight: 1.2, fontFamily: "var(--font-sans)" }}>
                            {item.title}
                          </p>
                          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "var(--font-sans)", marginTop: 6 }}>
                            {item.role}
                          </p>
                        </div>
                        {/* View case CTA — slides up on hover */}
                        <motion.div
                          variants={{
                            idle:  { opacity: 0, y: 8 },
                            hover: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.25, ease }}
                          style={{
                            flexShrink: 0,
                            marginLeft: 16,
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            borderRadius: 100,
                            padding: "8px 14px",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 500,
                            letterSpacing: "-0.3px",
                            fontFamily: "var(--font-sans)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          View case →
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.a>
            </motion.div>
          );
        })}
      </div>

      {/* Controls — centered below focused card */}
      <div className="shrink-0 flex items-center justify-center gap-4 mt-5">
        <button
          onClick={() => go(-1)}
          className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
          aria-label="Previous project"
        >
          <ChevronLeft />
        </button>

        <div className="flex gap-2 items-center">
          {orbitItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
              }`}
              aria-label={`Go to project ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
          aria-label="Next project"
        >
          <ChevronRight />
        </button>
      </div>

      </div>{/* end inner centering wrapper */}
    </div>
  );
}

// ── Mobile card with optional cycling images ──────────────────────────────────
function MobileCard({ item }: { item: OrbitItem }) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!item.images || item.images.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % item.images!.length);
    }, 500);
    return () => clearInterval(timer);
  }, [item.images]);

  const src = item.images ? item.images[slideIndex] : item.image;

  return (
    <a
      href={item.href}
      style={{
        display: "block",
        width: "100%",
        aspectRatio: "4/3",
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        textDecoration: "none",
      }}
    >
      <img
        src={src}
        alt={item.title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: "-0.3px", maxWidth: "65%", lineHeight: 1.3, fontFamily: "var(--font-sans)" }}>
          {item.title}
        </p>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 9, letterSpacing: "-0.2px", fontFamily: "var(--font-mono)" }}>
          {item.year}
        </p>
      </div>
      <div style={{ position: "absolute", bottom: 16, left: 16 }}>
        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, letterSpacing: "-0.2px", fontFamily: "var(--font-mono)" }}>
          {item.tag}
        </span>
      </div>
    </a>
  );
}

// ── Mobile: vertical stack ────────────────────────────────────────────────────
function MobileGallery() {
  return (
    <div
      id="portfolio"
      data-free-scroll="true"
      className="snap-section lg:hidden"
      style={{ paddingTop: 108, paddingBottom: 60 }}
    >
      <div className="px-8 pb-8">
        <h1 className="text-display font-sans text-[#0C0C12] whitespace-nowrap">
          Featured Work
        </h1>
      </div>

      <div className="flex flex-col gap-3 px-5">
        {orbitItems.map((item, i) => (
          <MobileCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  return (
    <>
      <DesktopOrbit />
      <MobileGallery />
    </>
  );
}
