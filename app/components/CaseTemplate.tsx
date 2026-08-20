"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { RevealLine, BlurReveal } from "./animations";
import Link from "next/link";
import { CaseData, CaseSection } from "@/app/lib/cases";
import { ProjectCard, projects, orbitItems, type OrbitItem } from "./ProjectsSection";
import CinematicBoard, { DEFAULT_SHOTS, DEFAULT_CURSORS } from "./CinematicBoard";

const ease = [0.22, 1, 0.36, 1] as const;


// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 8H3M3 8l5-5M3 8l5 5" />
    </svg>
  );
}

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

// ─── A. CaseHeroImageStrip ────────────────────────────────────────────────────
// Continuous conveyor-belt strip. Card rotateY is a function of screen x-position
// (not tied to a specific card) so each card's tilt smoothly updates as it drifts.

const HERO_BG = "#FFFFFF"; // strip edge fades — matches liquid wave background

function CaseHeroImageStrip({ images, inView }: { images: string[]; inView: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Landscape 3:2 cards
  const CARD_H = 260;  // px
  const CARD_W = 390;  // px  (3:2 ratio)
  const GAP = 6;
  const SPEED = 1.125;
  const MAX_ANGLE = 44; // degrees at screen edges

  // Which slot per set renders as the filmstrip variant
  const FILM_SLOT = Math.floor(images.length / 2);
  // Images to show inside the filmstrip (up to 4 thumbnails)
  const filmThumb = images.slice(0, 4);

  // Triple the array so the strip overflows both viewport sides seamlessly
  const isVideoSrc = (s: string) => /\.(mp4|webm|mov)$/i.test(s);
  const loopImages = [...images, ...images, ...images];
  const resetWidth = images.length * (CARD_W + GAP);
  const totalWidth  = loopImages.length * (CARD_W + GAP);

  useEffect(() => {
    if (!inView) return;
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLDivElement>("[data-card]"));

    const tick = () => {
      offsetRef.current -= SPEED;
      // Seamless reset: adding one set-width is invisible because images repeat
      if (offsetRef.current <= -resetWidth) offsetRef.current += resetWidth;

      const offset = offsetRef.current;
      const vw = container.offsetWidth;
      const stripStart = (vw - totalWidth) / 2; // negative → strip overflows both edges

      cards.forEach((card, i) => {
        const x  = stripStart + i * (CARD_W + GAP) + offset;
        const cx = x + CARD_W / 2;
        const t  = cx / vw;                          // 0 = left edge, 1 = right edge
        const ry = (0.5 - t) * MAX_ANGLE * 2;        // arc: +MAX left, -MAX right
        card.style.transform = `translateX(${x}px) rotateY(${ry}deg)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, images.length, resetWidth, totalWidth]);

  return (
    <>
      {/* ── RAF-driven 3D arc — all screen sizes ── */}
      <motion.div
        className="relative w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 1.0, ease, delay: 0.35 }}
      >
        {/* Perspective container */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: CARD_H,
            perspective: "1100px",
            perspectiveOrigin: "50% 50%",
          }}
        >
          {loopImages.map((src, i) => {
            const slotInSet = i % images.length;
            const isFilm = slotInSet === FILM_SLOT;
            return (
              <div
                key={i}
                data-card="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 6px 28px rgba(0,0,0,0.13)",
                  willChange: "transform",
                  // filmstrip card gets a dark frame
                  background: isFilm ? "#111" : undefined,
                  display: isFilm ? "flex" : "block",
                  alignItems: isFilm ? "stretch" : undefined,
                  gap: isFilm ? "4px" : undefined,
                  padding: isFilm ? "8px" : undefined,
                  boxSizing: isFilm ? "border-box" : undefined,
                }}
              >
                {isFilm ? (
                  filmThumb.map((ts, j) => (
                    <div key={j} style={{ flex: 1, borderRadius: 6, overflow: "hidden" }}>
                      {isVideoSrc(ts)
                        ? <video src={ts} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        : <img src={ts} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                    </div>
                  ))
                ) : isVideoSrc(src) ? (
                  <video src={src} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Edge fades — blend strip into background at both sides */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            background: `linear-gradient(to right, ${HERO_BG} 0%, transparent 10%, transparent 90%, ${HERO_BG} 100%)`,
          }}
        />
      </motion.div>

    </>
  );
}

// ─── A. CaseHero ──────────────────────────────────────────────────────────────
// Three-zone layout: title above the strip, subtitle+CTAs below it.
// Strip runs full-bleed horizontally through the middle.

function CaseHero({ caseData }: { caseData: CaseData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();

  const heroImages =
    caseData.heroImages && caseData.heroImages.length > 0
      ? caseData.heroImages
      : caseData.heroImage
      ? [caseData.heroImage]
      : [];

  return (
    <div
      ref={ref}
      className="relative snap-section flex flex-col"
      style={{ height: "100vh" }}
    >
      {/* Back button — mobile only, absolute top center */}
      <motion.div
        className="lg:hidden absolute z-20 left-0 right-0 flex justify-center"
        style={{ top: 118 }}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease }}
      >
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-sans text-[14px] font-medium text-[#565656] hover:text-[#0C0C12] tracking-[-0.28px] transition-colors"
        >
          <ArrowLeft />
          Back
        </button>
      </motion.div>

      {/* Top spacer: pushes content+strip group toward vertical center */}
      <div className="flex-1" />

      {/* ── Text content ── */}
      <div className="flex flex-col items-center text-center px-8 lg:px-[180px] pt-[60px] lg:pt-0 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <RevealLine className="text-serif-eyebrow text-[#0C0C12]" delay={0.1} inView={inView}>
            {caseData.heroLabel ?? `${caseData.client} | ${caseData.category}`}
          </RevealLine>
          <h1 className="text-section-heading text-[#2E2E2E] max-w-none w-full">
            {caseData.title.split("\n").map((line, i) => (
              <RevealLine key={i} className="block" delay={0.2 + i * 0.12} inView={inView}>
                {line}
              </RevealLine>
            ))}
          </h1>
          <BlurReveal
            text={caseData.subtitle}
            className="text-body text-[#565656] max-w-[640px] mt-1"
            delay={0.45}
          />
          <motion.div
            className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-center gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.65 }}
          >
            {caseData.websiteUrl && (
              <a
                href={caseData.websiteUrl}
                className="border border-[#2E2E2E]/15 rounded-full px-6 py-2.5 font-sans text-[14px] font-medium text-[#2E2E2E] inline-flex items-center justify-center gap-2 hover:border-[#2E2E2E]/40 transition-colors tracking-[-0.28px]"
              >
                View Website <ArrowUpRight />
              </a>
            )}
            {caseData.sections.some(s => s.type === "chapters") && (
              <>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { id: "chapters" } }))}
                  className="bg-[#0C0C12] rounded-full px-6 py-2.5 font-sans text-[14px] font-medium text-white inline-flex items-center justify-center gap-2 hover:bg-[#2E2E2E] transition-colors tracking-[-0.28px]"
                >
                  Explore the phases
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { index: 1 } }))}
                  className="border border-[#2E2E2E]/15 rounded-full px-6 py-2.5 font-sans text-[14px] font-medium text-[#2E2E2E] inline-flex items-center justify-center gap-2 hover:border-[#2E2E2E]/40 transition-colors tracking-[-0.28px]"
                >
                  About the Client
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom spacer: equal to top spacer, keeps content+strip group centered */}
      <div className="flex-1" />

      {/* ── Image strip: desktop only. Hidden on mobile to prevent overlap with
          hero buttons. Absolutely positioned so it straddles the hero/sections
          boundary. overflow: hidden clips horizontal card bleed. ── */}
      {heroImages.length > 0 && (
        <div className="hidden lg:block" style={{ position: "absolute", bottom: -130, left: 0, right: 0, zIndex: 5, overflow: "hidden" }}>
          <CaseHeroImageStrip images={heroImages} inView={inView} />
        </div>
      )}
    </div>
  );
}

// ─── B. SplitSection ─────────────────────────────────────────────────────────

// Cycles through paragraph chunks (max 2 at a time) as scroll progress advances.
function ChunkedText({
  chunks,
  bullets,
  progress,
}: {
  chunks: string[][];
  bullets?: string[];
  progress: MotionValue<number>;
}) {
  const numChunks = chunks.length;
  const [activeChunk, setActiveChunk] = useState(() =>
    Math.min(Math.floor(progress.get() * numChunks), numChunks - 1)
  );

  useEffect(() => {
    const sync = (p: number) =>
      setActiveChunk(Math.min(Math.floor(p * numChunks), numChunks - 1));
    sync(progress.get());
    return progress.on("change", sync);
  }, [progress, numChunks]);

  // Relative wrapper with stable min-height so chunk switches never shift the heading
  return (
    <div style={{ position: "relative", minHeight: "280px" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeChunk}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.35, ease }}
          className="flex flex-col gap-4"
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        >
          {chunks[activeChunk].map((para, i) => (
            <p key={i} className="text-body text-[#565656]">{para}</p>
          ))}
          {activeChunk === numChunks - 1 && bullets && (
            <ul className="flex flex-col gap-1 mt-1">
              {bullets.map((b, i) => (
                <li key={i} className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2">
                  <span className="shrink-0">·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SplitSection({ section }: { section: Extract<CaseSection, { type: "split" }> }) {
  const paragraphs = section.body.split("\n\n");
  const isLong = paragraphs.length > 3;

  // Group all paragraphs into pairs for the desktop chunked crossfade
  const chunks: string[][] = [];
  for (let i = 0; i < paragraphs.length; i += 2) {
    chunks.push(paragraphs.slice(i, i + 2));
  }
  const numChunks = chunks.length;

  // Two refs: mobileRef drives inView on mobile, desktopRef drives RAF progress on desktop.
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileInView = useInView(mobileRef, { once: true, margin: "-8%" });
  const desktopInView = useInView(desktopRef, { once: true, margin: "-8%" });
  const inView = mobileInView || desktopInView;

  const progress = useMotionValue(0);

  useEffect(() => {
    if (!isLong) return;
    let rafId: number;
    const tick = () => {
      const el = desktopRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable > 0) {
          progress.set(Math.max(0, Math.min(1, -rect.top / scrollable)));
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isLong, progress]);

  const MobileBullets = section.bullets ? (
    <ul className="flex flex-col gap-1 mt-1">
      {section.bullets.map((b, i) => (
        <motion.li
          key={i}
          className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.07 }}
        >
          <span className="shrink-0">·</span>
          <span>{b}</span>
        </motion.li>
      ))}
    </ul>
  ) : null;

  const innerContent = (
    <div className="flex flex-col w-full gap-8 lg:gap-10">
      <motion.p
        className="text-serif-eyebrow text-[#0C0C12]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        {section.label}
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32 lg:items-start">
        <div>
          <h2 className="text-section-heading text-[#2E2E2E]">
            {section.heading.split("\n").map((line, i) => (
              <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={inView}>
                {line}
              </RevealLine>
            ))}
          </h2>
        </div>

        <div className="mt-8 lg:mt-0 flex flex-col justify-start gap-4 lg:max-w-[520px]">
          {isLong ? (
            <>
              {/* Mobile: all paragraphs stacked naturally */}
              <div className="lg:hidden flex flex-col gap-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-body text-[#565656]">{para}</p>
                ))}
                {MobileBullets}
              </div>

              {/* Desktop: max 2 paragraphs at a time, crossfades as user scrolls */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.3 }}
              >
                <ChunkedText chunks={chunks} bullets={section.bullets} progress={progress} />
              </motion.div>
            </>
          ) : (
            <>
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  className="text-body text-[#565656]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
                >
                  {para}
                </motion.p>
              ))}
              {MobileBullets}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isLong) {
    return (
      <>
        {/* Mobile only: natural scroll through all paragraphs.
            lg:hidden → display:none on desktop, so the snap controller ignores it. */}
        <div
          ref={mobileRef}
          className="snap-section min-h-screen lg:hidden px-8 pt-24 pb-12 flex flex-col justify-center"
          data-native-scroll="true"
        >
          {innerContent}
        </div>

        {/* Desktop only: sticky with scroll height scaled per chunk count.
            hidden lg:block → display:none on mobile, so the snap controller ignores it. */}
        <div
          ref={desktopRef}
          className="snap-section hidden lg:block lg:px-[180px]"
          style={{ minHeight: `${(numChunks + 1) * 100}vh` }}
          data-free-scroll="true"
        >
          <div className="sticky top-0 h-screen flex flex-col justify-center py-16">
            {innerContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div ref={mobileRef} className="snap-section min-h-screen flex items-start lg:items-center px-8 lg:px-[180px] pt-24 pb-12 lg:py-16 relative bg-[#FAFAFA]" data-native-scroll="true">
      {innerContent}
    </div>
  );
}

// ─── C. CenteredSection ──────────────────────────────────────────────────────

function CenteredSection({ section }: { section: Extract<CaseSection, { type: "centered" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center justify-center px-8 lg:px-[180px] pt-24 pb-12 lg:py-16 relative bg-[#FAFAFA]" data-native-scroll="true">
      <div className="flex flex-col gap-8 lg:gap-10 max-w-[760px] w-full">

        {/* Label — above heading */}
        <motion.p
          className="text-serif-eyebrow text-[#0C0C12]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {section.label}
        </motion.p>

        {/* Heading + body */}
        <div className="flex flex-col gap-10">
          <h2
            className="text-section-heading text-[#2E2E2E]"
          >
            {section.heading.split("\n").map((line, i) => (
              <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={inView}>{line}</RevealLine>
            ))}
          </h2>
          <div className="flex flex-col gap-4">
            {section.body.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                className="text-body text-[#565656]"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
            {section.bullets && (
              <ul className="flex flex-col gap-1 mt-1">
                {section.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.07 }}
                  >
                    <span className="shrink-0">·</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── D. CarouselSection ──────────────────────────────────────────────────────

function CarouselSection({ section }: { section: Extract<CaseSection, { type: "carousel" }> }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const total = section.images.length;
  const go = (next: number) => setActive(((next % total) + total) % total);

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-center px-8 lg:px-[180px] py-24 lg:py-28 relative bg-[#FAFAFA]">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-[16/9] bg-[#0C0C12]"
          data-dark="true"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_e, info) => {
            if (Math.abs(info.velocity.x) > 200 || Math.abs(info.offset.x) > 60) {
              go(info.offset.x < 0 ? active + 1 : active - 1);
            }
          }}
          style={{ touchAction: "pan-y", cursor: "grab" }}
          whileTap={{ cursor: "grabbing" }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={section.images[active]}
              alt={`Slide ${active + 1}`}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              initial={{ scale: 1.0, opacity: 0 }}
              animate={{ scale: 1.06, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                scale: { duration: 9, ease: "linear" },
                opacity: { duration: 0.45, ease: "easeInOut" },
              }}
            />
          </AnimatePresence>
        </motion.div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 items-center">
            {section.images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(active - 1)}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => go(active + 1)}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── E. ScrollGallerySection ─────────────────────────────────────────────────

function ScrollGallerySection({ section }: { section: Extract<CaseSection, { type: "scroll-gallery" }> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 3-image triangle composition
  // Phase 1 (0–0.3): hero drifts slightly left, right image drifts up
  // Phase 2 (0.35–0.65): all converge to center
  // Phase 3 (0.7–0.9): hero expands to full screen

  // Hero (img[0]): near center-top, slightly left — the main focus
  const heroX = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 1], ["-4vw", "-4vw", "-4vw", "0vw", "0vw"]);
  const heroY = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 1], ["-14vh", "-14vh", "-14vh", "0vh", "0vh"]);

  // Left (img[1]): lower-left, stays
  const leftX = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 1], ["-22vw", "-22vw", "-22vw", "0vw", "0vw"]);
  const leftY = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 1], ["20vh", "20vh", "20vh", "0vh", "0vh"]);

  // Right (img[2]): lower-right, drifts up during phase 1
  const rightX = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 1], ["20vw", "20vw", "20vw", "0vw", "0vw"]);
  const rightY = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 1], ["20vh", "-4vh", "-4vh", "0vh", "0vh"]);

  const heroWidth  = useTransform(scrollYProgress, [0.65, 0.7, 0.9, 1], ["36vw", "36vw", "100vw", "100vw"]);
  const heroHeight = useTransform(scrollYProgress, [0.65, 0.7, 0.9, 1], ["44vh", "44vh", "100vh", "100vh"]);
  const underOpacity = useTransform(scrollYProgress, [0.75, 0.85], [1, 0]);

  const baseClass = "absolute left-1/2 top-1/2 overflow-hidden -translate-x-1/2 -translate-y-1/2 shadow-2xl will-change-transform";
  const imgStyle = (pos?: string): React.CSSProperties => ({ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos ?? "center", display: "block" });

  const [img0, img1, img2] = section.images;
  const [pos0, pos1, pos2] = section.positions ?? [];

  return (
    <>
      {/* Mobile: staggered cascade for 3 images */}
      <div className="lg:hidden" style={{ position: "relative", height: "130vw", overflow: "hidden", margin: "4rem 0" }}>
        {/* Image 1: top-left */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, ease, delay: 0 }}
          style={{
            position: "absolute", top: "5vw", left: "8vw",
            width: "64vw", height: "44vw", overflow: "hidden",
            zIndex: 3, borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
          }}>
          <img src={img0} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos0 ?? "center", display: "block" }} />
        </motion.div>
        {/* Image 2: mid-left */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          style={{
            position: "absolute", top: "46vw", left: "2vw",
            width: "64vw", height: "44vw", overflow: "hidden",
            zIndex: 2, borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
          }}>
          <img src={img1} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos1 ?? "center", display: "block" }} />
        </motion.div>
        {/* Image 3: lower-right */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          style={{
            position: "absolute", top: "58vw", left: "28vw",
            width: "64vw", height: "44vw", overflow: "hidden",
            zIndex: 3, borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}>
          <img src={img2} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos2 ?? "center", display: "block" }} />
        </motion.div>
      </div>

      {/* Desktop: scroll choreography — triangle composition */}
      <div
        ref={containerRef}
        className="hidden lg:block snap-section"
        style={{ height: "300vh" }}
        data-free-scroll="true"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">

            {/* Left image → stays, then converges */}
            <motion.div style={{ x: leftX, y: leftY, opacity: underOpacity, width: "36vw", maxHeight: "44vh" }} className={`${baseClass} z-10 rounded`}>
              <img src={img1} alt="" style={imgStyle(pos1)} />
            </motion.div>

            {/* Right image → drifts up, then converges */}
            <motion.div style={{ x: rightX, y: rightY, opacity: underOpacity, width: "36vw", maxHeight: "44vh" }} className={`${baseClass} z-20 rounded`}>
              <img src={img2} alt="" style={imgStyle(pos2)} />
            </motion.div>

            {/* Hero → near center, then expands to full screen */}
            <motion.div
              style={{ x: heroX, y: heroY, width: heroWidth, height: heroHeight }}
              className={`${baseClass} z-30 rounded`}
            >
              <img src={img0} alt="" style={imgStyle(pos0)} />
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── F. ImageBlockSection ────────────────────────────────────────────────────

function ImageBlockSection({ section }: { section: Extract<CaseSection, { type: "image-block" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <div ref={ref} className="snap-section min-h-screen flex items-center justify-center px-[10vw] relative bg-[#FAFAFA]">
      <motion.img
        src={section.src}
        alt=""
        style={{ width: "100%", display: "block", borderRadius: 4 }}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
      />
    </div>
  );
}

// ─── G. StatsSectionBlock ────────────────────────────────────────────────────

function StatsSectionBlock({ section }: { section: Extract<CaseSection, { type: "stats" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center px-8 lg:px-[180px] pt-24 pb-12 lg:py-16 relative bg-[#FAFAFA]" data-native-scroll="true">
      <div className="flex flex-col gap-8 lg:gap-10 w-full">

        {/* Label */}
        <motion.p
          className="text-serif-eyebrow text-[#0C0C12]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {section.label}
        </motion.p>

        {/* Heading — full width above both columns */}
        <h2 className="text-section-heading text-[#2E2E2E] whitespace-pre-line">
          <RevealLine delay={0.15} inView={inView}>
            {section.heading}
          </RevealLine>
        </h2>

        {/* Two-column body — both top-aligned 24px below heading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32 lg:items-start" style={{ marginTop: 24 }}>

          {/* Left — first paragraph */}
          <div className="flex flex-col gap-4">
            {section.body.split("\n\n").slice(0, 2).map((para, i) => (
              <motion.p
                key={i}
                className="text-body text-[#565656]"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.3 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Right — remaining paragraphs + bullets */}
          <div className="mt-6 lg:mt-0 flex flex-col gap-4">
            {section.body.split("\n\n").slice(2).map((para, i) => (
              <motion.p
                key={i}
                className="text-body text-[#565656]"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.35 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
            {section.bullets && (
              <ul className="flex flex-col gap-1 mt-1">
                {section.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.07 }}
                  >
                    <span className="shrink-0">·</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── F. RelatedProjects ──────────────────────────────────────────────────────

function RelatedProjects({
  currentSlug,
  eyebrow = "Keep Stalking",
  heading = "Recommended projects",
  prioritizeSlugs = [],
}: {
  currentSlug: string;
  eyebrow?: string;
  heading?: string;
  prioritizeSlugs?: string[];
}) {
  const others = projects.filter((p) => p.slug !== currentSlug);
  const priority = others.filter((p) => prioritizeSlugs.includes(p.slug));
  const rest = others.filter((p) => !prioritizeSlugs.includes(p.slug));
  const related = [...priority, ...rest].slice(0, 3);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center px-8 lg:px-[180px] pt-24 pb-16 lg:py-32 relative bg-[#FAFAFA]" data-native-scroll="true">
      <div className="w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.p
            className="text-serif-eyebrow text-[#0C0C12]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            {eyebrow}
          </motion.p>
          <h2 className="text-section-title text-[#2E2E2E] mt-1">
            <RevealLine delay={0.15} inView={inView}>{heading}</RevealLine>
          </h2>
        </div>

        {/* Desktop: 3 full-width cards */}
        <div className="hidden lg:flex gap-6">
          {related.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.12 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          <div className="relative w-full max-w-[302px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
              >
                <ProjectCard project={related[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between w-full max-w-[302px]">
            <p className="text-ui text-[#565656]">
              {String(active + 1).padStart(2, "0")}/{String(related.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => go(Math.max(0, active - 1))}
                disabled={active === 0}
                className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] disabled:opacity-30 hover:border-[#2E2E2E]/40 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => go(Math.min(related.length - 1, active + 1))}
                disabled={active === related.length - 1}
                className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] disabled:opacity-30 hover:border-[#2E2E2E]/40 transition-colors"
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── G. KeepStalkingCarousel (orbit carousel for non-GXM cases) ───────────────

function KeepStalkingCarousel({ currentSlug }: { currentSlug: string }) {
  const items = orbitItems.filter(item => !item.href.endsWith(`/${currentSlug}`));
  const total = items.length;
  const [active, setActive] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const go = (dir: number) => setActive((prev) => ((prev + dir) % total + total) % total);

  useEffect(() => { setSlideIndex(0); }, [active]);

  useEffect(() => {
    const activeItem = items[active];
    if (!activeItem?.images || activeItem.images.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % activeItem.images!.length);
    }, 500);
    return () => clearInterval(timer);
  }, [active]);

  return (
    <>
      {/* Desktop: orbit carousel */}
      <div
        className="snap-section hidden lg:flex flex-col"
        style={{ height: "100vh", paddingTop: 80, paddingBottom: 36 }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="text-serif-eyebrow text-[#0C0C12] text-center" style={{ marginBottom: 6 }}>Keep Stalking</p>
          <h2
            className="font-sans font-medium text-[#0C0C12] text-center shrink-0"
            style={{ fontSize: "clamp(52px, 7vw, 88px)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: 24 }}
          >
            More work
          </h2>

          {/* Orbit stage */}
          <div className="relative overflow-hidden flex items-center justify-center" style={{ height: "58vh" }}>
            {items.map((item, i) => {
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
                    variants={{ idle: { scale: 1 }, hover: { scale: 1.025 } }}
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
                            <motion.div
                              variants={{ idle: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
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

          {/* Controls */}
          <div className="shrink-0 flex items-center justify-center gap-4 mt-5">
            <button
              onClick={() => go(-1)}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft />
            </button>
            <div className="flex gap-2 items-center">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${i === active ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"}`}
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
      </div>

      {/* Mobile: vertical stack */}
      <div
        className="snap-section lg:hidden"
        data-free-scroll="true"
        style={{ paddingTop: 108, paddingBottom: 60 }}
      >
        <div className="px-8 pb-8">
          <p className="text-serif-eyebrow text-[#0C0C12]" style={{ marginBottom: 4 }}>Keep Stalking</p>
          <h2 className="text-section-title text-[#2E2E2E]">More work</h2>
        </div>
        <div className="flex flex-col gap-3 px-5">
          {items.map((item, i) => (
            <a
              key={i}
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
                src={item.staticImage ?? item.image}
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
          ))}
        </div>
      </div>
    </>
  );
}

// ─── H. TimelineItem (desktop scroll-activated) ──────────────────────────────

type ChapterItemType = {
  part: string; title: string; description: string;
  image: string; video?: string; slug?: string;
};

function TimelineItem({
  item, i, activeIndex, onActivate,
}: {
  item: ChapterItemType; i: number; activeIndex: number; onActivate: (i: number) => void;
}) {
  const ref        = useRef<HTMLDivElement>(null);
  const inViewOnce = useInView(ref, { once: true,  margin: "-15%" });
  const inViewLive = useInView(ref, { once: false, margin: "-20% 0px -30% 0px" });

  useEffect(() => { if (inViewLive) onActivate(i); }, [inViewLive, i, onActivate]);

  // D: parallax on image
  const { scrollYProgress: itemScroll } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(itemScroll, [0, 1], ["-8%", "8%"]);

  const avail    = !!item.slug;
  const textLeft = i % 2 === 0;

  // C: spotlight opacity — future 0.08, active 1, past 0.35
  const targetOpacity = !inViewOnce ? 0.08 : i === activeIndex ? 1 : 0.35;

  // A: text slides in from outer edge
  const textXFrom  = textLeft ? -50 : 50;
  const imageXFrom = textLeft ?  50 : -50;

  const textSide = (
    <motion.div
      className={`flex-1 flex ${textLeft ? "justify-end pr-16" : "justify-start pl-16"}`}
      animate={{ opacity: targetOpacity, x: inViewOnce ? 0 : textXFrom }}
      transition={{ duration: 0.8, ease }}
    >
      <div className={`flex flex-col gap-4 max-w-[340px] ${textLeft ? "items-end text-right" : "items-start text-left"}`}>
        <span className="text-micro text-[#0C0C12]" style={{ border: "1px solid rgba(0,0,0,0.18)", borderRadius: 100, padding: "3px 10px" }}>
          {item.part}
        </span>
        <h3 className="text-subheading text-[#0C0C12]">{item.title}</h3>
        <p className="text-body text-[#565656]">{item.description}</p>
        {avail ? (
          <a href={`/cases/${item.slug}`} className="text-ui text-[#0C0C12] inline-flex items-center gap-2">
            Read case <ArrowUpRight />
          </a>
        ) : (
          <span className="text-micro text-[#B0B0B0]" style={{ border: "1px solid #E0E0E0", borderRadius: 100, padding: "3px 10px" }}>
            Coming soon
          </span>
        )}
      </div>
    </motion.div>
  );

  const imageSide = (
    <motion.div
      className={`flex-1 flex ${textLeft ? "justify-start pl-16" : "justify-end pr-16"}`}
      animate={{ opacity: targetOpacity, x: inViewOnce ? 0 : imageXFrom }}
      transition={{ duration: 0.8, ease, delay: 0.07 }}
    >
      {/* B: clip-path wipe | D: parallax inner */}
      <motion.div
        className="relative overflow-hidden rounded-2xl w-full"
        style={{ aspectRatio: "16/9", maxWidth: 460 }}
        animate={{
          clipPath: inViewOnce
            ? "inset(0% 0% 0% 0% round 16px)"
            : textLeft
              ? "inset(0% 100% 0% 0% round 16px)"
              : "inset(0% 0% 0% 100% round 16px)",
        }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <motion.div style={{ y: imageY, height: "116%", width: "100%", marginTop: "-8%", position: "relative" }}>
          {item.video
            ? <video src={item.video} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)" }} />
        {!avail && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />}
      </motion.div>
    </motion.div>
  );

  return (
    <div ref={ref} className="relative flex items-start">
      {textLeft ? textSide : imageSide}

      {/* Dot with sonar pulse */}
      <div style={{ position: "relative", width: 12, height: 12, flexShrink: 0, marginTop: 7, zIndex: 2 }}>
        {inViewOnce && avail && (
          <motion.div
            style={{ position: "absolute", inset: -6, borderRadius: "50%", border: "1.5px solid #0C0C12" }}
            animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
          />
        )}
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: inViewOnce ? (avail ? "#0C0C12" : "#C8C8C8") : "#E0E0E0",
          border: "2px solid #FAFAFA",
          boxShadow: "0 0 0 1px " + (inViewOnce ? (avail ? "#0C0C12" : "#C8C8C8") : "#E0E0E0"),
          transition: "background 0.5s ease, box-shadow 0.5s ease",
        }} />
      </div>

      {textLeft ? imageSide : textSide}
    </div>
  );
}

// ─── G. ChaptersSection ──────────────────────────────────────────────────────

function ChaptersSection({ section }: { section: Extract<CaseSection, { type: "chapters" }> }) {
  const mobileRef  = useRef<HTMLDivElement>(null);
  const itemsRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const handleActivate = useCallback((i: number) => setActiveIndex(i), []);

  const mobileInView = useInView(mobileRef, { once: true, margin: "-8%" });

  // Bar fill: tracks the items container as it scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: itemsRef, offset: ["start center", "end center"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <>
      {/* ── Mobile: timeline cards ──────────────────────────────── */}
      <div
        id="chapters"
        className="snap-section min-h-screen lg:hidden px-8 pt-24 pb-12"
        data-native-scroll="true"
      >
        <div ref={mobileRef} className="flex flex-col gap-8">
          {/* Static heading */}
          <div className="flex flex-col gap-3">
            <motion.p
              className="text-serif-eyebrow text-[#0C0C12]"
              initial={{ opacity: 0 }} animate={mobileInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              {section.label}
            </motion.p>
            <h2 className="text-section-heading text-[#2E2E2E] whitespace-pre-line">
              {section.heading.split("\n").map((line, i) => (
                <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={mobileInView}>{line}</RevealLine>
              ))}
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col">
            {/* Continuous spine line behind all dots */}
            <div className="absolute w-px bg-[#E0E0E0]" style={{ left: 4, top: 8, bottom: 8 }} />

            {section.items.map((item, i) => {
              const avail = !!item.slug;
              return (
                <motion.div
                  key={i}
                  className="flex gap-4 pb-8 last:pb-0"
                  initial={{ opacity: 0, y: 16 }}
                  animate={mobileInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.08 }}
                >
                  {/* Dot */}
                  <div style={{ width: 10, flexShrink: 0, paddingTop: 5, position: "relative", zIndex: 1 }}>
                    <div style={{
                      width: 9, height: 9, borderRadius: "50%",
                      background: avail ? "#0C0C12" : "#C4C4C4",
                      border: "2px solid #FAFAFA",
                    }} />
                  </div>

                  {/* Card content */}
                  <div className="flex-1" style={{ opacity: avail ? 1 : 0.5 }}>
                    <p className="text-micro text-[#565656] mb-2">{item.part}</p>
                    {avail ? (
                      <a href={`/cases/${item.slug}`} className="block">
                        <div className="relative overflow-hidden rounded-xl mb-3" style={{ aspectRatio: "16/9" }}>
                          {item.video ? (
                            <video src={item.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <p className="text-subheading text-[#0C0C12] mt-1">{item.title}</p>
                        <p className="text-body text-[#565656] mt-1">{item.description}</p>
                      </a>
                    ) : (
                      <div>
                        <div className="relative overflow-hidden rounded-xl mb-3" style={{ aspectRatio: "16/9" }}>
                          {item.video ? (
                            <video src={item.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <p className="text-subheading text-[#0C0C12] mt-1">{item.title}</p>
                        <p className="text-body text-[#565656] mt-1">{item.description}</p>
                        <span className="inline-block mt-2 text-micro text-[#565656] border border-[#C4C4C4] rounded-full px-2.5 py-0.5">Coming soon</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Desktop: heading + timeline ── */}
      <div
        ref={sectionRef}
        id="chapters"
        className="snap-section hidden lg:block lg:px-[180px]"
        style={{ scrollSnapAlign: "none", paddingTop: 160, paddingBottom: 120 }}
        data-free-scroll="true"
        data-native-scroll="true"
      >
        {/* Static heading */}
        <div className="flex flex-col gap-3 mb-24">
          <p className="text-serif-eyebrow text-[#0C0C12]">{section.label}</p>
          <h2 className="text-section-heading text-[#2E2E2E] whitespace-pre-line">{section.heading}</h2>
        </div>

        {/* Timeline */}
        <div ref={itemsRef} className="relative">
          <div style={{ position: "absolute", left: "calc(50% - 0.5px)", top: 0, bottom: 0, width: 1, background: "#E8E8E8" }} />
          <motion.div style={{ position: "absolute", left: "calc(50% - 0.5px)", top: 0, width: 1, height: lineHeight, background: "#0C0C12" }} />
          <div className="flex flex-col gap-28">
            {section.items.map((item, i) => (
              <TimelineItem key={i} item={item} i={i} activeIndex={activeIndex} onActivate={handleActivate} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── ContainedMedia ──────────────────────────────────────────────────────────

function ContainedMedia({ video, image, videoPosition }: { video?: string; image?: string; videoPosition?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  if (!video && !image) return null;
  return (
    <div ref={ref} className="snap-section min-h-screen flex items-center justify-center px-[10vw] relative bg-[#FAFAFA]">
      <motion.div
        style={{ width: "100%" }}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
      >
        {video ? (
          videoPosition ? (
            <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: 4 }}>
              <video
                src={video}
                autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: videoPosition, display: "block" }}
              />
            </div>
          ) : (
            <video
              src={video}
              autoPlay muted loop playsInline
              style={{ width: "100%", display: "block", borderRadius: 4 }}
            />
          )
        ) : (
          <img
            src={image}
            alt=""
            style={{ width: "100%", display: "block", borderRadius: 4 }}
          />
        )}
      </motion.div>
    </div>
  );
}

// ─── Section dispatcher ───────────────────────────────────────────────────────

function CaseSectionBlock({ section }: { section: CaseSection }) {
  switch (section.type) {
    case "split":
      return (
        <>
          <SplitSection section={section} />
          <ContainedMedia video={section.video} image={section.image} videoPosition={section.videoPosition} />
        </>
      );
    case "centered":
      return <CenteredSection section={section} />;
    case "carousel":
      return section.images.length > 0 ? <CarouselSection section={section} /> : null;
    case "scroll-gallery":
      return <ScrollGallerySection section={section} />;
    case "image-block":
      return <ImageBlockSection section={section} />;
    case "stats":
      return <StatsSectionBlock section={section} />;
    case "chapters":
      return <ChaptersSection section={section} />;
    case "cinematic":
      return (
        <CinematicBoard
          src={section.src}
          shots={section.shots as import("./CinematicBoard").BoardShot[] | undefined}
          cursors={section.cursors as import("./CinematicBoard").CursorDef[] | undefined}
          height={section.height}
          bg={section.bg}
        />
      );
    default:
      return null;
  }
}

// ─── Root export ─────────────────────────────────────────────────────────────

const GXM_OVERVIEW_SLUG = "gxm";
const GXM_PART1_SLUG = "gxm-building-alignment-before-software";
const GXM_PART2_SLUG = "gxm-validate-before-you-build";
const GXM_PART3_SLUG = "gxm-design-system-brand-foundations";
const GXM_ALL_SLUGS = [GXM_OVERVIEW_SLUG, GXM_PART1_SLUG, GXM_PART2_SLUG, GXM_PART3_SLUG];

export default function CaseTemplate({ caseData }: { caseData: CaseData }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setEntered(true); }, []);

  const isGXMOverview = caseData.slug === GXM_OVERVIEW_SLUG;
  const isGXMPart = caseData.slug === GXM_PART1_SLUG || caseData.slug === GXM_PART2_SLUG || caseData.slug === GXM_PART3_SLUG;

  let relatedEyebrow = "Keep Stalking";
  let relatedHeading = "Recommended projects";
  let relatedPriority: string[] = [];

  if (isGXMOverview) {
    relatedEyebrow = "Go deeper";
    relatedHeading = "Explore each phase in detail";
    relatedPriority = [GXM_PART1_SLUG, GXM_PART2_SLUG];
  } else if (isGXMPart) {
    relatedEyebrow = "Continue your reading";
    relatedHeading = "More on this digital transformation";
    relatedPriority = GXM_ALL_SLUGS.filter((s) => s !== caseData.slug);
  }

  return (
    <article>
      {/* White page-entry fade — prevents the black flash from IntroLoader and gives a clean entrance */}
      <motion.div
        className="fixed inset-0 bg-white pointer-events-none"
        style={{ zIndex: 9998 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: entered ? 0 : 1 }}
        transition={{ duration: 0.7, ease }}
      />
      <CaseHero caseData={caseData} />

      {/* Opaque wrapper so the global liquid wave doesn't bleed into content sections.
          paddingTop: 130 compensates for the image strip bridging 130px below the hero. */}
      <div style={{ background: "#FAFAFA", paddingTop: (caseData.heroImages?.length ?? 0) > 0 || caseData.heroImage ? 130 : 0 }}>
        {caseData.sections.map((section, i) => (
          <CaseSectionBlock key={i} section={section} />
        ))}

        {isGXMPart && (
          <RelatedProjects
            currentSlug={caseData.slug}
            eyebrow={relatedEyebrow}
            heading={relatedHeading}
            prioritizeSlugs={relatedPriority}
          />
        )}
        {!isGXMOverview && !isGXMPart && (
          <KeepStalkingCarousel currentSlug={caseData.slug} />
        )}
      </div>
    </article>
  );
}
