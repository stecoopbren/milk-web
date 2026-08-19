"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import CinematicBoard, { type BoardShot, type CursorDef, DEFAULT_SHOTS, DEFAULT_CURSORS } from "./CinematicBoard";


export type OrbitItem = {
  title: string;
  role: string;
  year: string;
  image: string;
  images?: string[];
  staticImage?: string;
  href: string;
  tag: string;
  /** If set, replaces the image on the active card with a CinematicBoard */
  cinematicSrc?: string;
  cinematicShots?: BoardShot[];
  cinematicCursors?: CursorDef[];
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
    category: "Brand Strategy & Growth",
    title: "Turning raw land into a $2M investment story.",
    description: "Full community master plan delivered in 10 weeks.",
    img: "/Chaguite/chaguite-hero.webp",
  },
  {
    id: 1,
    slug: "casa-siwa",
    category: "Brand Identity & Digital Experience",
    title: "Turning a luxury retreat into a narrative people want to belong to.",
    description: "Brand strategy, digital experience, and editorial art direction.",
    img: "/Siwa/siwa-hero-wide.webp",
  },
  {
    id: 2,
    slug: "gxm",
    category: "Product Strategy & UX Design",
    title: "The expertise was never the problem.",
    description: "120+ countries. Two prior attempts. Thirty days to ship the third.",
    img: "/GXM/IMG_9702.jpg",
  },
  {
    id: 3,
    slug: "gxm-building-alignment-before-software",
    category: "Product Strategy & UX Design",
    title: "Building alignment before software.",
    description: "Product shipped after multiple failed attempts.",
    img: "/GXM/gxm-workshop.png",
    hidden: true,
  },
  {
    id: 4,
    slug: "gxm-validate-before-you-build",
    category: "Product Strategy & UX Design",
    title: "From hypothesis to evidence.",
    description: "12 interviews, full audit, competitive analysis. Build decision backed by evidence.",
    img: "/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png",
    hidden: true,
  },
  {
    id: 5,
    slug: "gxm-design-system-brand-foundations",
    category: "Product Design · Design Systems",
    title: "Velocity by design. Not by headcount.",
    description: "Design tokens, PrimeReact, Token Studio sync. The system that made thirty-day delivery possible.",
    img: "/GXM/Case 4/Screenshot 2026-08-17 at 3.22.01 PM.png",
    hidden: true,
  },
];

// Orbit-ready items
export const orbitItems: OrbitItem[] = [
  {
    title: "Digital Transformation", role: "Product Strategy & Design Lead", year: "2024",
    image: "/GXM/IMG_9711.jpg",
    staticImage: "/GXM/IMG_9702.jpg",
    images: [
      "/GXM/IMG_9711.jpg",
      "/GXM/IMG_9702.jpg",
      "/GXM/Case 2/gxm-remote-workshop.png",
      "/GXM/Case 2/Screenshot 2026-08-03 at 10.25.22 AM.png",
      "/GXM/gxm-journey-map.png",
      "/GXM/Case 2/Screenshot 2026-08-03 at 11.06.20 AM.png",
      "/GXM/Case 2/Assesment.png",
      "/GXM/Case 2/gxm-programs.png",
      "/GXM/Case 2/assesment 2.png",
      "/GXM/gxm-scope-definition.png",
      "/GXM/Case 2/Screenshot 2024-07-25 at 4.14.41 PM.png",
      "/GXM/gxm-data-structure.png",
      "/GXM/Case 2/Screenshot 2026-08-03 at 5.43.18 PM.png",
      "/GXM/Case 2/Screenshot 2026-08-03 at 5.31.41 PM.png",
    ],
    href: "/cases/gxm", tag: "Enterprise SaaS",
    cinematicSrc: "/GXM/gxm-journey-map.png",
    cinematicShots: [
      { x: 0,   y: 0,   scale: 1.0,  hold: 2.5 },
      { x: 24,  y: 8,   scale: 2.2,  hold: 5.0, label: "Programs & Ownership" },
      { x: -12, y: -10, scale: 2.5,  hold: 5.0, label: "Customer Journey" },
      { x: -22, y: 12,  scale: 2.1,  hold: 4.5, label: "Service Gaps" },
      { x: 0,   y: 0,   scale: 1.1,  hold: 2.5 },
    ],
    cinematicCursors: [
      { name: "Steven",  color: "#FF3377", path: [[25, 50], [42, 32], [58, 55], [38, 68]], stepDuration: 3.2, startDelay: 0.0 },
      { name: "Lena",    color: "#FACC15", path: [[68, 22], [55, 40], [72, 58], [60, 35]], stepDuration: 3.8, startDelay: 0.8 },
      { name: "Marcus",  color: "#3B82F6", path: [[15, 30], [30, 55], [20, 72], [35, 45]], stepDuration: 4.1, startDelay: 1.4 },
      { name: "Elise",   color: "#22C55E", path: [[78, 45], [62, 28], [80, 18], [70, 60]], stepDuration: 3.5, startDelay: 2.0 },
      { name: "Jordan",  color: "#A855F7", path: [[48, 70], [60, 50], [45, 35], [55, 65]], stepDuration: 4.4, startDelay: 1.0 },
      { name: "Hugo",    color: "#F97316", path: [[82, 70], [72, 48], [88, 30], [75, 65]], stepDuration: 3.9, startDelay: 2.6 },
    ],
  },
  {
    title: "Regenerative Community", role: "Growth & Brand Lead", year: "2026",
    image: "/Chaguite/hero.webp", staticImage: "/Chaguite/card-cover.webp",
    images: [
      "/Chaguite/hero.webp",
      "/Chaguite/concept-2.webp",
      "/Chaguite/billboard.webp",
      "/Chaguite/concept-89.webp",
      "/Chaguite/concept-1.webp",
      "/Chaguite/hf_interior_regen.webp",
      "/Chaguite/concept-5.webp",
    ],
    href: "/cases/regenerative-community", tag: "Real Estate",
  },
  {
    title: "Casa Siwä", role: "Brand & Experience Lead", year: "2025",
    image: "/Siwa/siwa-stone-hero.webp", staticImage: "/Siwa/siwa-stone-hero.webp",
    images: [
      "/Siwa/siwa-stone-hero.webp",
      "/Siwa/hf_20260530_004913_e18d2766-720f-4b3d-aeea-19042417dcfc.webp",
      "/Siwa/hf_20260530_005122_ae9a197c-8f5f-48be-8c2a-88569d98af81.webp",
      "/Siwa/hf_20260530_010108_6cc9af61-f105-4d35-a456-02c70122d4fa.webp",
      "/Siwa/hf_20260530_010422_6e1baf86-9dd4-4520-a506-bf51ac168b75.webp",
      "/Siwa/hf_20260530_010811_ab2a0e3b-dac8-4a94-aeec-97b849ecf02a.webp",
      "/Siwa/hf_20260530_011818_1ccc9b48-4177-4e24-931e-79b8b3b2da5f.webp",
    ],
    href: "/cases/casa-siwa", tag: "Hospitality",
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
                {isActive && item.cinematicSrc ? (
                  <div style={{ position: "absolute", inset: 0 }}>
                    <CinematicBoard
                      src={item.cinematicSrc}
                      shots={item.cinematicShots ?? DEFAULT_SHOTS}
                      cursors={item.cinematicCursors ?? DEFAULT_CURSORS}
                      height={800}
                      bg="#0C0C12"
                    />
                  </div>
                ) : (
                  <img
                    src={isActive
                      ? (item.images ? item.images[slideIndex] : item.image)
                      : (item.staticImage ?? item.image)}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                )}

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

// ── Mobile card ───────────────────────────────────────────────────────────────
function MobileCard({ item }: { item: OrbitItem }) {
  // Use the static cover image (same as desktop side cards), not the cycling reel
  const src = item.staticImage ?? item.image;

  return (
    <a
      href={item.href}
      style={{
        display: "block",
        width: "100%",
        height: 380,
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

// ── Mobile: carousel ─────────────────────────────────────────────────────────
function MobileCarousel() {
  const [active, setActive] = useState(0);
  const total = orbitItems.length;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const cardOpacity = useTransform(x, [-220, 0, 220], [0.5, 1, 0.5]);

  const go = (d: number) => {
    const target = d > 0 ? -420 : 420;
    animate(x, target, { duration: 0.32, ease: [0.22, 1, 0.36, 1] }).then(() => {
      setActive((prev) => ((prev + d) % total + total) % total);
      x.set(0);
    });
  };

  const goTo = (i: number) => go(i > active ? 1 : -1);

  const handleDragEnd = (_: never, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    if (offset.x < -60 || velocity.x < -400) {
      go(1);
    } else if (offset.x > 60 || velocity.x > 400) {
      go(-1);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <div
      id="portfolio"
      className="snap-section lg:hidden"
      style={{ paddingTop: 108, paddingBottom: 60 }}
    >
      <div className="px-8 pb-6 text-center">
        <h2 className="text-heading text-[#0C0C12]">
          Featured Work
        </h2>
      </div>

      <div className="px-5 overflow-hidden">
        <motion.div
          key={active}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          style={{ x, rotate, opacity: cardOpacity, cursor: "grab", touchAction: "pan-y" }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          whileDrag={{ cursor: "grabbing" }}
        >
          <MobileCard item={orbitItems[active]} />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-5">
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
              onClick={() => goTo(i)}
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
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  return (
    <>
      <DesktopOrbit />
      <MobileCarousel />
    </>
  );
}
