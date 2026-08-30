"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import CinematicBoard, { type BoardShot, type CursorDef, DEFAULT_SHOTS, DEFAULT_CURSORS } from "./CinematicBoard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
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
    staticImage: "/GXM/mockuuups-female-in-the-office-working-on-a-macbook-mockup.webp",
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
  },
  {
    title: "Regenerative Community", role: "Growth & Brand Lead", year: "2026",
    image: "/Chaguite/hero.webp", staticImage: "/Chaguite/hf_concept4_regen.webp",
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
  {
    title: "Dropclub", role: "Business Design & Lean Validation", year: "2026",
    image: "/DC/Mocks/Lifestyle.png",
    staticImage: "/DC/Mocks/Lifestyle.png",
    images: [
      "/DC/Mocks/Lifestyle.png",
      "/DC/Mocks/mockuuups-iphone-17-pro-mockup-held-over-a-gray-fabric-surface.webp",
      "/DC/Mocks/mockuuups-iphone-17-pro-mockup-held-over-a-gray-fabric-surface.webp",
      "/DC/Mocks/mockuuups-free-iphone-17-pro-mockup-in-hand.webp",
      "/DC/Stories/dc-nude.webp",
      "/DC/Stories/dc-sambas.webp",
    ],
    href: "/cases/dropclub", tag: "Commerce",
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

const CARD_W = 640;
const CARD_H = 480;
const SIDE_OFFSET = 400; // px from center to side-card center

const mobileCss = `
  .milk-swiper-mobile {
    width: 100%;
    overflow: visible !important;
    padding-bottom: 0 !important;
  }
  .milk-swiper-mobile .swiper-slide {
    width: 85vw;
    max-width: 360px;
    border-radius: 16px;
    overflow: hidden;
  }
`;

// ── Shared slide content ───────────────────────────────────────────────────────
function SlideContent({
  item,
  index,
  activeIndex,
  isActive,
  cinematicReady,
  isMobile,
  swiperRef,
}: {
  item: OrbitItem;
  index: number;
  activeIndex: number;
  isActive: boolean;
  cinematicReady: boolean;
  isMobile: boolean;
  swiperRef: React.RefObject<SwiperType | null>;
}) {
  return (
    <a
      href={isActive ? item.href : undefined}
      onClick={(e) => { if (!isActive) { e.preventDefault(); swiperRef.current?.slideToLoop(index); } }}
      style={{ display: "block", width: "100%", height: "100%", position: "relative", textDecoration: "none" }}
    >
      {/* Image or CinematicBoard (desktop only) */}
      {!isMobile && index === activeIndex && item.cinematicSrc && cinematicReady ? (
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <CinematicBoard
            src={item.cinematicSrc}
            shots={item.cinematicShots ?? DEFAULT_SHOTS}
            cursors={item.cinematicCursors ?? DEFAULT_CURSORS}
            height={500}
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
            <p className="text-micro" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>
              {item.tag} · {item.year}
            </p>
            <p className="text-subheading" style={{ color: "#fff" }}>
              {item.title}
            </p>
            <p className="text-body" style={{ color: "rgba(255,255,255,0.5)", marginTop: 6 }}>
              {item.role}
            </p>
          </div>
        </div>
      )}
    </a>
  );
}

// ── Dot indicators (shared) ────────────────────────────────────────────────────
function Dots({ count, active, onDotClick }: { count: number; active: number; onDotClick: (i: number) => void }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`rounded-full transition-all duration-300 ${
            i === active ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
          }`}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ── Mobile swipe hint ──────────────────────────────────────────────────────────
function SwipeHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      setVisible(false);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(true), 4000);
    };
    timer = setTimeout(() => setVisible(true), 4000);
    window.addEventListener("touchmove", reset, { passive: true });
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("touchmove", reset);
      window.removeEventListener("scroll", reset);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className="flex items-center gap-3"
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4l-6 6 6 6" stroke="#2E2E2E" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(47,47,47,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path d="M8 1C9.5 1 10.5 2 10.5 3.5v8C10.5 13 9.5 14 8 14s-2.5-1-2.5-2.5v-8C5.5 2 6.5 1 8 1z" stroke="#2E2E2E" strokeOpacity="0.4" strokeWidth="1.2" />
                  <path d="M10.5 6.5C12 6.5 14 7.5 14 9.5v4C14 16.5 11.5 19 8 19S2 16.5 2 13.5v-4C2 7.5 4 6.5 5.5 6.5" stroke="#2E2E2E" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="#2E2E2E" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="text-micro" style={{ color: "rgba(47,47,47,0.4)" }}>swipe</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Coverflow carousel ─────────────────────────────────────────────────────────
function CoverflowCarousel({ initialIndex = 0 }: { initialIndex?: number }) {
  const swiperMobile = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const n = orbitItems.length;
  const goNext = () => setActiveIndex(i => (i + 1) % n);
  const goPrev = () => setActiveIndex(i => (i - 1 + n) % n);

  return (
    <div
      id="portfolio"
      className="snap-section flex flex-col"
      style={{ height: "100vh", paddingTop: 80, paddingBottom: 36, background: "#FFFFFF", overflowY: "clip" }}
    >
      <style>{mobileCss}</style>

      {/* ── DESKTOP: custom 3-card coverflow ── */}
      <div className="hidden lg:flex flex-col" style={{ flex: 1, justifyContent: "center" }}>
        <h2
          className="font-sans font-medium text-[#0C0C12] text-center shrink-0"
          style={{ fontSize: "clamp(40px, 7vw, 88px)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: 32 }}
        >
          Featured Work
        </h2>

        {/* 3-card coverflow — all cards in DOM, positioned via CSS transforms */}
        <div style={{ position: "relative", height: CARD_H, perspective: "1400px" }}>
          {orbitItems.map((item, i) => {
            const diff = (i - activeIndex + n) % n;
            const isActive = diff === 0;
            const isRight = diff === 1;
            const isLeft = diff === n - 1;
            const isVisible = isActive || isRight || isLeft;
            const tx = isActive ? 0 : isRight ? SIDE_OFFSET : -SIDE_OFFSET;
            const ry = isActive ? 0 : isRight ? -30 : 30;
            const sc = isActive ? 1 : 0.78;
            const op = isVisible ? 1 : 0;
            const zi = isActive ? 10 : 1;
            return (
              <a
                key={item.href}
                href={isActive ? item.href : undefined}
                onClick={isActive ? undefined : (e) => { e.preventDefault(); if (isVisible) { isRight ? goNext() : goPrev(); } }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `calc(50% - ${CARD_W / 2}px)`,
                  width: CARD_W,
                  height: CARD_H,
                  display: "block",
                  textDecoration: "none",
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: isVisible ? "pointer" : "default",
                  pointerEvents: isVisible ? "auto" : "none",
                  zIndex: zi,
                  transform: `translateX(${tx}px) rotateY(${ry}deg) scale(${sc})`,
                  opacity: op,
                  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                  boxShadow: isActive ? "0 24px 80px rgba(0,0,0,0.28)" : "0 8px 40px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={item.staticImage ?? item.image}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {isActive && (
                  <div style={{ position: "absolute", inset: 0 }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
                    <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                      <p className="text-micro" style={{ color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>{item.tag} · {item.year}</p>
                      <p className="text-subheading" style={{ color: "#fff" }}>{item.title}</p>
                      <p className="text-body" style={{ color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{item.role}</p>
                    </div>
                  </div>
                )}
              </a>
            );
          })}
        </div>

        <div className="shrink-0 flex items-center justify-center gap-4" style={{ marginTop: 28 }}>
          <button
            onClick={goPrev}
            className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft />
          </button>
          <Dots count={n} active={activeIndex} onDotClick={setActiveIndex} />
          <button
            onClick={goNext}
            className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
            aria-label="Next project"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* ── MOBILE: peek slider ── */}
      <div className="flex lg:hidden flex-col" style={{ flex: 1, justifyContent: "center" }}>
        <h2
          className="font-sans font-medium text-[#0C0C12] text-center shrink-0"
          style={{ fontSize: "clamp(32px, 9vw, 48px)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: 24 }}
        >
          Featured Work
        </h2>

        <div className="relative w-full">
          <Swiper
            onSwiper={(s) => { swiperMobile.current = s; }}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
            initialSlide={0}
            effect="slide"
            slidesPerView={1.15}
            spaceBetween={14}
            slidesOffsetBefore={24}
            slidesOffsetAfter={24}
            loop
            centeredSlides={false}
            modules={[]}
            className="milk-swiper-mobile w-full"
            style={{ height: "clamp(360px, 55vh, 500px)" }}
          >
            {orbitItems.map((item, i) => (
              <SwiperSlide key={item.href}>
                {({ isActive }) => (
                  <SlideContent
                    item={item} index={i} activeIndex={activeIndex}
                    isActive={isActive} cinematicReady={false}
                    isMobile={true} swiperRef={swiperMobile}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          <SwipeHint />
        </div>

        <div className="shrink-0 flex items-center justify-center gap-4" style={{ marginTop: 20 }}>
          <button
            onClick={() => swiperMobile.current?.slidePrev()}
            className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft />
          </button>
          <Dots count={orbitItems.length} active={activeIndex} onDotClick={(i) => swiperMobile.current?.slideToLoop(i)} />
          <button
            onClick={() => swiperMobile.current?.slideNext()}
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
export default function ProjectsSection({ initialIndex }: { initialIndex?: number } = {}) {
  return <CoverflowCarousel initialIndex={initialIndex} />;
}
