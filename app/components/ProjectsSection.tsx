"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import CinematicBoard, { type BoardShot, type CursorDef, DEFAULT_SHOTS, DEFAULT_CURSORS } from "./CinematicBoard";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";


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

const coverflowCss = `
  .milk-swiper {
    width: 100%;
    padding-bottom: 52px !important;
  }
  .milk-swiper .swiper-slide {
    width: clamp(460px, 54vw, 780px);
    border-radius: 16px;
    overflow: hidden;
    cursor: grab;
  }
  .milk-swiper .swiper-slide:active { cursor: grabbing; }
  .milk-swiper .swiper-pagination-bullet {
    background: #0C0C12 !important;
    opacity: 0.2;
    width: 6px;
    height: 6px;
    transition: all 0.3s;
  }
  .milk-swiper .swiper-pagination-bullet-active {
    opacity: 1;
    width: 20px;
    border-radius: 3px;
  }
`;

// ── Coverflow carousel (desktop + mobile) ─────────────────────────────────────
function CoverflowCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      id="portfolio"
      className="snap-section flex flex-col"
      style={{ height: "100vh", paddingTop: 80, paddingBottom: 36 }}
    >
      <style>{coverflowCss}</style>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* Heading */}
        <h2
          className="font-sans font-medium text-[#0C0C12] text-center shrink-0"
          style={{ fontSize: "clamp(40px, 7vw, 88px)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: 32 }}
        >
          Featured Work
        </h2>

        {/* Swiper */}
        <Swiper
          onSwiper={(s) => { swiperRef.current = s; }}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          initialSlide={0}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          coverflowEffect={{
            rotate: 38,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="milk-swiper w-full"
          style={{ height: "clamp(300px, 58vh, 600px)" }}
        >
          {orbitItems.map((item, i) => (
            <SwiperSlide key={item.href}>
              {({ isActive }) => (
                <a
                  href={isActive ? item.href : undefined}
                  onClick={(e) => { if (!isActive) { e.preventDefault(); swiperRef.current?.slideToLoop(i); } }}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    textDecoration: "none",
                  }}
                >
                  {isActive && item.cinematicSrc ? (
                    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                      <CinematicBoard
                        src={item.cinematicSrc}
                        shots={item.cinematicShots ?? DEFAULT_SHOTS}
                        cursors={item.cinematicCursors ?? DEFAULT_CURSORS}
                        height={640}
                      />
                    </div>
                  ) : (
                    <img
                      src={item.staticImage ?? item.image}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  )}

                  {/* Scrim on inactive */}
                  {!isActive && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)" }} />
                  )}

                  {/* Caption on active */}
                  {isActive && (
                    <div style={{ position: "absolute", inset: 0 }}>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
                      <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, letterSpacing: "-0.3px", fontFamily: "var(--font-mono)", marginBottom: 6 }}>
                          {item.tag} · {item.year}
                        </p>
                        <p style={{ color: "#fff", fontSize: 18, fontWeight: 600, letterSpacing: "-0.7px", lineHeight: 1.2, fontFamily: "var(--font-sans)" }}>
                          {item.title}
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "var(--font-sans)", marginTop: 5 }}>
                          {item.role}
                        </p>
                      </div>
                    </div>
                  )}
                </a>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controls */}
        <div className="shrink-0 flex items-center justify-center gap-4" style={{ marginTop: 4 }}>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft />
          </button>

          <div className="flex gap-2 items-center">
            {orbitItems.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
                }`}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
            aria-label="Next project"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  return <CoverflowCarousel />;
}
