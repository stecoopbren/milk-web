"use client";

import { useRef, useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { RevealLine } from "./animations";
import { CaseData, CaseSection } from "@/app/lib/cases";
import ProjectsSection from "./ProjectsSection";
import SocialCards from "./ui/card-fan-carousel";
import CinematicBoard from "./CinematicBoard";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 8H3M3 8l5-5M3 8l5 5" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── A. CaseHeroImageStrip ────────────────────────────────────────────────────
// Continuous conveyor-belt strip. Card rotateY is a function of screen x-position
// (not tied to a specific card) so each card's tilt smoothly updates as it drifts.

const HERO_BG = "#FAFAFA"; // strip edge fades — matches site background

function CaseHeroImageStrip({ images, inView }: { images: string[]; inView: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Landscape 3:2 cards
  const CARD_H = 260; // px
  const CARD_W = 390; // px  (3:2 ratio)
  const GAP = 0;
  const SPEED = 1.125;
  const MAX_ANGLE = 44; // degrees at screen edges

  // Cap unique images to 8 to limit initial network load, then triple for seamless loop
  const isVideoSrc = (s: string) => /\.(mp4|webm|mov)$/i.test(s);
  const capped = images.slice(0, 8);
  const loopImages = [...capped, ...capped, ...capped];
  const resetWidth = capped.length * (CARD_W + GAP);
  const totalWidth = loopImages.length * (CARD_W + GAP);

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
        const x = stripStart + i * (CARD_W + GAP) + offset;
        const cx = x + CARD_W / 2;
        const t = cx / vw; // 0 = left edge, 1 = right edge
        const ry = (0.5 - t) * MAX_ANGLE * 2; // arc: +MAX left, -MAX right
        card.style.transform = `translateX(${x}px) rotateY(${ry}deg)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, capped.length, resetWidth, totalWidth]);

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
                  boxShadow: "none",
                  willChange: "transform",
                  background: "transparent",
                }}
              >
                {isVideoSrc(src) ? (
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={src}
                    alt=""
                    {...(i === 0
                      ? { fetchPriority: "high" as const, loading: "eager" as const }
                      : { loading: "lazy" as const })}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Edge fades — blend strip into background at both sides */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 2,
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
    <div ref={ref} className="snap-section relative flex flex-col" style={{ height: "100vh" }}>
      {/* Back button — mobile only, absolute top center */}
      <motion.div
        className="absolute right-0 left-0 z-20 flex justify-center lg:hidden"
        style={{ top: 118 }}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease }}
      >
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-sans text-[14px] font-medium tracking-[-0.28px] text-[#565656] transition-colors hover:text-[#0C0C12]"
        >
          <ArrowLeft />
          Back
        </button>
      </motion.div>

      {/* Top spacer: pushes content+strip group toward vertical center */}
      <div className="flex-1" />

      {/* ── Text content ── */}
      <div className="relative z-10 flex flex-col items-center px-8 pt-[60px] text-center lg:px-[180px] lg:pt-0">
        <div className="flex flex-col items-center gap-4">
          <RevealLine className="text-serif-eyebrow text-[#0C0C12]" delay={0.1} inView={inView}>
            {caseData.heroLabel ?? `${caseData.client} | ${caseData.category}`}
          </RevealLine>
          <h1 className="text-section-heading w-full max-w-none text-[#2E2E2E]">
            {caseData.title.split("\n").map((line, i) => (
              <RevealLine key={i} className="block" delay={0.2 + i * 0.12} inView={inView}>
                {line}
              </RevealLine>
            ))}
          </h1>
          <motion.p
            className="text-body mt-1 max-w-[640px] text-[#565656]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.45 }}
          >
            {caseData.subtitle}
          </motion.p>
          <motion.div
            className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.65 }}
          >
            {caseData.websiteUrl && (
              <a
                href={caseData.websiteUrl}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2E2E2E]/15 px-6 py-2.5 font-sans text-[14px] font-medium tracking-[-0.28px] text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40"
              >
                View Website <ArrowUpRight />
              </a>
            )}
            {caseData.sections.some((s) => s.type === "chapters") && (
              <>
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("milk:snap-to", { detail: { id: "chapters" } }),
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0C0C12] px-6 py-2.5 font-sans text-[14px] font-medium tracking-[-0.28px] text-white transition-colors hover:bg-[#2E2E2E]"
                >
                  Explore the phases
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { index: 1 } }))
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2E2E2E]/15 px-6 py-2.5 font-sans text-[14px] font-medium tracking-[-0.28px] text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40"
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
        <div
          style={{
            position: "absolute",
            bottom: -210,
            left: 0,
            right: 0,
            zIndex: 5,
            overflow: "hidden",
          }}
        >
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
    Math.min(Math.floor(progress.get() * numChunks), numChunks - 1),
  );

  useEffect(() => {
    const sync = (p: number) => setActiveChunk(Math.min(Math.floor(p * numChunks), numChunks - 1));
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
            <p key={i} className="text-body text-[#565656]">
              {para}
            </p>
          ))}
          {activeChunk === numChunks - 1 && bullets && (
            <ul className="mt-1 flex flex-col gap-1">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex gap-2 font-sans text-[16px] leading-[1.2] tracking-[-0.32px] text-[#565656]"
                >
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
    <ul className="mt-1 flex flex-col gap-1">
      {section.bullets.map((b, i) => (
        <motion.li
          key={i}
          className="flex gap-2 font-sans text-[16px] leading-[1.2] tracking-[-0.32px] text-[#565656]"
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
    <div className="flex w-full flex-col gap-8 lg:gap-10">
      <motion.p
        className="text-serif-eyebrow text-[#0C0C12]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        {section.label}
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-32">
        <div>
          <h2 className="text-section-heading text-[#2E2E2E]">
            {section.heading.split("\n").map((line, i) => (
              <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={inView}>
                {line}
              </RevealLine>
            ))}
          </h2>
        </div>

        <div className="mt-8 flex flex-col justify-start gap-4 lg:mt-0 lg:max-w-[520px]">
          {isLong ? (
            <>
              {/* Mobile: all paragraphs stacked naturally */}
              <div className="flex flex-col gap-4 lg:hidden">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-body text-[#565656]">
                    {para}
                  </p>
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
          className="snap-section flex min-h-screen flex-col justify-center px-8 pt-24 pb-12 lg:hidden"
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
          <div className="sticky top-0 flex h-screen flex-col justify-center py-16">
            {innerContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      ref={mobileRef}
      className="snap-section relative flex min-h-screen items-start bg-[#FAFAFA] px-8 pt-24 pb-12 lg:items-center lg:px-[180px] lg:py-16"
      data-native-scroll="true"
    >
      {innerContent}
    </div>
  );
}

// ─── C. CenteredSection ──────────────────────────────────────────────────────

function CenteredSection({ section }: { section: Extract<CaseSection, { type: "centered" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div
      ref={ref}
      className="snap-section relative flex min-h-screen items-start justify-center bg-[#FAFAFA] px-8 pt-24 pb-12 lg:items-center lg:px-[180px] lg:py-16"
      data-native-scroll="true"
    >
      <div className="flex w-full max-w-[760px] flex-col gap-8 lg:gap-10">
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
          <h2 className="text-section-heading text-[#2E2E2E]">
            {section.heading.split("\n").map((line, i) => (
              <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={inView}>
                {line}
              </RevealLine>
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
              <ul className="mt-1 flex flex-col gap-1">
                {section.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-2 font-sans text-[16px] leading-[1.2] tracking-[-0.32px] text-[#565656]"
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(innerRef, { once: true, margin: "-8%" });

  const total = section.images.length;
  const go = (next: number) => setActive(((next % total) + total) % total);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Advance the active slide as the user scrolls through the section
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      setActive(Math.min(total - 1, Math.floor(v * total)));
    });
  }, [scrollYProgress, total]);

  return (
    <div
      ref={sectionRef}
      className="snap-section"
      data-native-scroll="true"
      style={{ height: `${total * 100}vh` }}
    >
      <div
        ref={innerRef}
        className="relative sticky top-0 flex items-center bg-[#FAFAFA] px-8 py-24 lg:px-[180px] lg:py-28"
        style={{ height: "100svh" }}
      >
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
        >
          <motion.div
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#0C0C12] lg:aspect-[16/9]"
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
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
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
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {section.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? "h-[6px] w-5 bg-[#0C0C12]" : "h-[6px] w-[6px] bg-[#C0C0C0]"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go(active - 1)}
                className="inline-flex items-center justify-center rounded-full border border-[#2E2E2E]/15 p-2.5 text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => go(active + 1)}
                className="inline-flex items-center justify-center rounded-full border border-[#2E2E2E]/15 p-2.5 text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40"
                aria-label="Next image"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── E. ScrollGallerySection ─────────────────────────────────────────────────

function ScrollGallerySection({
  section,
}: {
  section: Extract<CaseSection, { type: "scroll-gallery" }>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 3-image triangle composition
  // Phase 1 (0–0.3): hero drifts slightly left, right image drifts up
  // Phase 2 (0.35–0.65): all converge to center
  // Phase 3 (0.7–0.9): hero expands to full screen

  // Hero (img[0]): near center-top, slightly left — the main focus
  const heroX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 1],
    ["-4vw", "-4vw", "-4vw", "0vw", "0vw"],
  );
  const heroY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 1],
    ["-14vh", "-14vh", "-14vh", "0vh", "0vh"],
  );

  // Left (img[1]): lower-left, stays
  const leftX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 1],
    ["-22vw", "-22vw", "-22vw", "0vw", "0vw"],
  );
  const leftY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 1],
    ["20vh", "20vh", "20vh", "0vh", "0vh"],
  );

  // Right (img[2]): lower-right, drifts up during phase 1
  const rightX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 1],
    ["20vw", "20vw", "20vw", "0vw", "0vw"],
  );
  const rightY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.35, 0.65, 1],
    ["20vh", "-4vh", "-4vh", "0vh", "0vh"],
  );

  const heroWidth = useTransform(
    scrollYProgress,
    [0.65, 0.7, 0.9, 1],
    ["36vw", "36vw", "100vw", "100vw"],
  );
  const heroHeight = useTransform(
    scrollYProgress,
    [0.65, 0.7, 0.9, 1],
    ["44vh", "44vh", "100vh", "100vh"],
  );
  const underOpacity = useTransform(scrollYProgress, [0.6, 0.68], [1, 0]);
  const heroOpacity = useMotionValue(1);
  const introScale = useTransform(scrollYProgress, [0, 0.12], [0.88, 1]);

  const baseClass =
    "absolute left-1/2 top-1/2 overflow-hidden -translate-x-1/2 -translate-y-1/2 shadow-2xl will-change-transform";
  const imgStyle = (pos?: string): React.CSSProperties => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: pos ?? "center",
    display: "block",
  });

  const [img0, img1, img2] = section.images;
  const [pos0, pos1, pos2] = section.positions ?? [];

  return (
    <>
      {/* Mobile: simple stacked layout — no scroll choreography, no motion */}
      <div ref={mobileRef} className="snap-section lg:hidden" style={{ padding: "60px 16px 60px" }}>
        <div
          style={{
            width: "100%",
            height: "55svh",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <Image
            width={0}
            height={0}
            sizes="100vw"
            src={img0}
            alt=""
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{ display: "flex", gap: 10, height: "38svh" }}>
          {img1 && (
            <div style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                src={img1}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )}
          {img2 && (
            <div style={{ flex: 1, borderRadius: 12, overflow: "hidden" }}>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                src={img2}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Desktop: scroll choreography — triangle composition */}
      <div
        ref={containerRef}
        className="snap-section hidden lg:block"
        style={{ height: "300vh" }}
        data-free-scroll="true"
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ background: "#FAFAFA" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Left image → stays, then converges */}
            <motion.div
              style={{
                x: leftX,
                y: leftY,
                opacity: underOpacity,
                scale: introScale,
                width: "36vw",
                maxHeight: "44vh",
              }}
              className={`${baseClass} z-10 rounded-xl`}
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                src={img1}
                alt=""
                loading="lazy"
                style={imgStyle(pos1)}
              />
            </motion.div>

            {/* Right image → drifts up, then converges */}
            <motion.div
              style={{
                x: rightX,
                y: rightY,
                opacity: underOpacity,
                scale: introScale,
                width: "36vw",
                maxHeight: "44vh",
              }}
              className={`${baseClass} z-20 rounded-xl`}
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                src={img2}
                alt=""
                loading="lazy"
                style={imgStyle(pos2)}
              />
            </motion.div>

            {/* Hero → near center, then expands to full screen */}
            <motion.div
              style={{
                x: heroX,
                y: heroY,
                width: heroWidth,
                height: heroHeight,
                opacity: heroOpacity,
                scale: introScale,
              }}
              className={`${baseClass} z-30 rounded-xl`}
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                src={img0}
                alt=""
                loading="lazy"
                style={imgStyle(pos0)}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── F. ImageBlockSection ────────────────────────────────────────────────────

function ImageBlockSection({
  section,
}: {
  section: Extract<CaseSection, { type: "image-block" }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <div
      ref={ref}
      className="snap-section relative flex min-h-screen items-center justify-center bg-[#FAFAFA] px-[10vw]"
    >
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
    <div
      ref={ref}
      className="snap-section relative flex min-h-screen items-start bg-[#FAFAFA] px-8 pt-24 pb-12 lg:items-center lg:px-[180px] lg:py-16"
      data-native-scroll="true"
    >
      <div className="flex w-full flex-col gap-8 lg:gap-10">
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
        <h2 className="text-section-heading whitespace-pre-line text-[#2E2E2E]">
          <RevealLine delay={0.15} inView={inView}>
            {section.heading}
          </RevealLine>
        </h2>

        {/* Two-column body — both top-aligned 24px below heading */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start lg:gap-32">
          {/* Left — first paragraph */}
          <div className="flex flex-col gap-4">
            {section.body
              .split("\n\n")
              .slice(0, 2)
              .map((para, i) => (
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
          <div className="mt-6 flex flex-col gap-4 lg:mt-0">
            {section.body
              .split("\n\n")
              .slice(2)
              .map((para, i) => (
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
              <ul className="mt-1 flex flex-col gap-1">
                {section.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-2 font-sans text-[16px] leading-[1.2] tracking-[-0.32px] text-[#565656]"
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

// ─── G. KeepStalkingCarousel (orbit carousel for non-GXM cases) ───────────────

// ─── H. TimelineItem (desktop scroll-activated) ──────────────────────────────

type ChapterItemType = {
  part: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  slug?: string;
};

// ─── H0. MobileTimelineCard (per-card entrance + reveal on mobile) ───────────

function MobileTimelineCard({ item }: { item: ChapterItemType; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-6%" });
  const avail = !!item.slug;

  const mediaBlock = (
    <motion.div
      className="relative mb-3 overflow-hidden"
      style={{ aspectRatio: "16/9" }}
      animate={{ clipPath: inView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
    >
      <motion.div
        style={{ height: "116%", width: "100%", marginTop: "-8%", position: "relative" }}
        animate={{ scale: inView ? 1 : 1.06 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      >
        {item.video ? (
          <video
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="eager"
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      ref={cardRef}
      className="flex gap-4 pb-8 last:pb-0"
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease, delay: 0.08 }}
    >
      {/* Dot */}
      <div style={{ width: 10, flexShrink: 0, paddingTop: 5, position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: avail ? "#0C0C12" : "#C4C4C4",
            border: "2px solid #FAFAFA",
          }}
        />
      </div>

      {/* Card */}
      <div className="flex-1" style={{ opacity: avail ? 1 : 0.5 }}>
        <p className="text-micro mb-2 text-[#565656]">{item.part}</p>
        {avail ? (
          <a href={`/cases/${item.slug}`} className="block">
            {mediaBlock}
            <p className="text-subheading mt-1 text-[#0C0C12]">{item.title}</p>
            <p className="text-body mt-1 text-[#565656]">{item.description}</p>
          </a>
        ) : (
          <div>
            {mediaBlock}
            <p className="text-subheading mt-1 text-[#0C0C12]">{item.title}</p>
            <p className="text-body mt-1 text-[#565656]">{item.description}</p>
            <span className="text-micro mt-2 inline-block rounded-full border border-[#C4C4C4] px-2.5 py-0.5 text-[#565656]">
              Coming soon
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── G0. PhaseSnapSection (desktop: one full-viewport snap-section per phase) ─

function PhaseSnapSection({
  item,
  i,
  chapterLabel,
  chapterHeading,
}: {
  item: ChapterItemType;
  i: number;
  isLast: boolean;
  firstAvailSlug?: string;
  chapterLabel?: string;
  chapterHeading?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inViewOnce = useInView(ref, { once: true, margin: "-10%" });

  // Scroll-driven exit: content lifts as section scrolls off the top
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  // Parallax on image
  const { scrollYProgress: imgScroll } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(imgScroll, [0, 1], ["-6%", "6%"]);

  const avail = !!item.slug;
  const textLeft = i % 2 === 0;

  const textContent = (
    <div className={`flex flex-1 ${textLeft ? "justify-end pr-16" : "justify-start pl-16"}`}>
      <div
        className={`flex max-w-[340px] flex-col gap-4 ${textLeft ? "items-end text-right" : "items-start text-left"}`}
      >
        <span
          className="text-micro text-[#0C0C12]"
          style={{ border: "1px solid rgba(0,0,0,0.18)", borderRadius: 100, padding: "3px 10px" }}
        >
          {item.part}
        </span>
        <h3 className="text-subheading text-[#0C0C12]">{item.title}</h3>
        <p className="text-body text-[#565656]">{item.description}</p>
        {avail ? (
          <a
            href={`/cases/${item.slug}`}
            className="text-ui inline-flex items-center gap-2 text-[#0C0C12]"
          >
            Read case <ArrowUpRight />
          </a>
        ) : (
          <span
            className="text-micro text-[#B0B0B0]"
            style={{ border: "1px solid #E0E0E0", borderRadius: 100, padding: "3px 10px" }}
          >
            Coming soon
          </span>
        )}
      </div>
    </div>
  );

  const imageInner = (
    <motion.div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16/9", maxWidth: 460 }}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={inViewOnce ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
    >
      <motion.div
        style={{ y: imageY, height: "116%", width: "100%", marginTop: "-8%", position: "relative" }}
      >
        {item.video ? (
          <video
            src={item.video}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="eager"
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </motion.div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      {!avail && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />}
    </motion.div>
  );

  const imageContent = (
    <div className={`flex flex-1 ${textLeft ? "justify-start pl-16" : "justify-end pr-16"}`}>
      {avail ? (
        <a
          href={`/cases/${item.slug}`}
          className="w-full"
          style={{ maxWidth: 460, display: "block" }}
        >
          {imageInner}
        </a>
      ) : (
        imageInner
      )}
    </div>
  );

  return (
    <div
      ref={ref}
      id={chapterLabel ? "chapters" : undefined}
      className="snap-section hidden flex-col lg:flex"
      style={{ minHeight: "100svh" }}
    >
      {/* Scroll-driven exit: lifts and fades as section scrolls off the top */}
      <motion.div
        style={{ y: exitY }}
        className="flex flex-1 flex-col justify-center lg:px-[180px]"
      >
        {/* Chapter heading — only on first phase */}
        {chapterLabel && chapterHeading && (
          <div className="mb-[112px] flex flex-col items-center gap-3 text-center">
            <p className="text-serif-eyebrow text-[#0C0C12]">{chapterLabel}</p>
            <h2 className="text-section-heading whitespace-pre-line text-[#2E2E2E]">
              {chapterHeading}
            </h2>
          </div>
        )}
        {/* Entrance animation */}
        <motion.div
          className="relative flex w-full items-center"
          initial={{ opacity: 0, y: 28 }}
          animate={inViewOnce ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease }}
        >
          {/* Vertical spine line through center dot */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: i === 0 ? "50%" : "-50vh",
              bottom: "-50vh",
              width: 1,
              background: "#E0E0E0",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          />

          {textLeft ? textContent : imageContent}

          {/* Center dot */}
          <div style={{ position: "relative", width: 12, flexShrink: 0, zIndex: 2 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: avail ? "#0C0C12" : "#C8C8C8",
                border: "2px solid #FAFAFA",
                boxShadow: "0 0 0 1px " + (avail ? "#0C0C12" : "#C8C8C8"),
              }}
            />
            {avail && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  border: "1.5px solid #0C0C12",
                }}
                animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
              />
            )}
          </div>

          {textLeft ? imageContent : textContent}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── G. ChaptersSection ──────────────────────────────────────────────────────

function ChaptersSection({ section }: { section: Extract<CaseSection, { type: "chapters" }> }) {
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileInView = useInView(mobileRef, { once: true, margin: "-8%" });
  const firstAvailSlug = section.items.find((it) => !!it.slug)?.slug;

  return (
    <>
      {/* ── Mobile: timeline cards ──────────────────────────────── */}
      <div
        id="chapters-mobile"
        className="snap-section min-h-screen px-8 pt-24 pb-12 lg:hidden"
        data-native-scroll="true"
      >
        <div ref={mobileRef} className="flex flex-col gap-8">
          {/* Static heading */}
          <div className="flex flex-col gap-3">
            <motion.p
              className="text-serif-eyebrow text-[#0C0C12]"
              initial={{ opacity: 0 }}
              animate={mobileInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              {section.label}
            </motion.p>
            <h2 className="text-section-heading whitespace-pre-line text-[#2E2E2E]">
              {section.heading.split("\n").map((line, i) => (
                <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={mobileInView}>
                  {line}
                </RevealLine>
              ))}
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative flex flex-col">
            {/* Continuous spine line behind all dots */}
            <div className="absolute w-px bg-[#E0E0E0]" style={{ left: 4, top: 8, bottom: 8 }} />

            {section.items.map((item, i) => (
              <MobileTimelineCard key={i} item={item} i={i} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop: one snap-section per phase (heading embedded in first) ── */}
      {section.items.map((item, i) => (
        <PhaseSnapSection
          key={i}
          item={item}
          i={i}
          isLast={i === section.items.length - 1}
          firstAvailSlug={firstAvailSlug}
          chapterLabel={i === 0 ? section.label : undefined}
          chapterHeading={i === 0 ? section.heading : undefined}
        />
      ))}

      {/* ── Desktop: Go deeper CTA — own snap section ── */}
      {firstAvailSlug && (
        <div
          className="snap-section hidden flex-col items-center justify-center gap-5 text-center lg:flex lg:px-[180px]"
          style={{ minHeight: "100svh" }}
        >
          <p className="text-serif-eyebrow text-[#0C0C12]">Go deeper</p>
          <h3 className="text-section-heading max-w-[640px] text-[#2E2E2E]">
            Every phase built on what the one before proved.
          </h3>
          <p className="text-body max-w-[400px] text-[#565656]">
            The product shipped because the thinking came first. Start with the decision that made
            all the others possible.
          </p>
          <a
            href={`/cases/${firstAvailSlug}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#0C0C12] px-6 py-2.5 font-sans text-[14px] font-medium tracking-[-0.28px] text-white transition-colors hover:bg-[#2E2E2E]"
          >
            Start with Phase 1
            <ArrowUpRight />
          </a>
        </div>
      )}
    </>
  );
}

// ─── ContainedMedia ──────────────────────────────────────────────────────────

function ContainedMedia({
  video,
  image,
  videoPosition,
  alt,
}: {
  video?: string;
  image?: string;
  videoPosition?: string;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  if (!video && !image) return null;
  return (
    <div
      ref={ref}
      className="snap-section relative flex min-h-screen items-center justify-center bg-[#FAFAFA] px-5 lg:px-[10vw]"
    >
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
      >
        {video ? (
          videoPosition ? (
            <div className="h-[80svh] w-full overflow-hidden rounded-[4px] lg:h-[56vw]">
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: videoPosition,
                  display: "block",
                }}
              />
            </div>
          ) : (
            <div className="h-[80svh] w-full overflow-hidden rounded-[4px] lg:h-auto">
              <video
                src={video}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-full object-cover lg:h-auto"
                style={{ display: "block" }}
              />
            </div>
          )
        ) : (
          <div className="h-[80svh] w-full overflow-hidden rounded-[4px] lg:h-auto">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              src={image!}
              alt={alt ?? ""}
              loading="lazy"
              className="h-full w-full object-cover lg:h-auto"
              style={{ display: "block" }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Section dispatcher ───────────────────────────────────────────────────────

// ─── Fan Gallery Section ──────────────────────────────────────────────────────

function FanGallerySection({
  section,
}: {
  section: Extract<CaseSection, { type: "fan-gallery" }>;
}) {
  const cards = section.images.map((imgUrl, i) => ({
    imgUrl,
    videoUrl: section.videos?.[i] ?? null,
  }));
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.35], [24, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const cardsY = useTransform(scrollYProgress, [0.2, 0.5], [32, 0]);

  return (
    <div
      ref={sectionRef}
      className="snap-section"
      data-free-scroll="true"
      style={{ height: "180vh" }}
    >
      <div
        className="sticky top-0 flex flex-col items-center justify-center overflow-hidden bg-[#FAFAFA]"
        style={{ height: "100svh", paddingTop: 84, paddingBottom: 48 }}
      >
        {(section.label || section.heading) && (
          <motion.div
            style={{ opacity: headingOpacity, y: headingY }}
            className="mb-6 w-full max-w-[640px] px-8 text-center lg:px-0"
          >
            {section.label && (
              <p className="text-serif-eyebrow mb-3 text-[#0C0C12]">{section.label}</p>
            )}
            {section.heading && (
              <h2 className="text-section-heading text-[#2E2E2E]">{section.heading}</h2>
            )}
          </motion.div>
        )}
        <motion.div
          style={{ opacity: cardsOpacity, y: cardsY }}
          className="w-full px-8 lg:px-[180px]"
        >
          {inView && <SocialCards cards={cards} />}
        </motion.div>
      </div>
    </div>
  );
}

function CaseSectionBlock({ section }: { section: CaseSection }) {
  switch (section.type) {
    case "split":
      return (
        <>
          <SplitSection section={section} />
          <ContainedMedia
            video={section.video}
            image={section.image}
            videoPosition={section.videoPosition}
            alt={section.heading.replace(/\n/g, " ")}
          />
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
    case "fan-gallery":
      return <FanGallerySection section={section} />;
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

// ─── PasswordGate ─────────────────────────────────────────────────────────────

const SESSION_KEY = "milk_gxm_unlocked";
const noopSubscribe = () => () => {};
const GXM_PASSWORD = "skimmed";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const attempt = () => {
    if (value.trim().toLowerCase() === GXM_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setShake(true);
      setWrong(true);
      setValue("");
      setTimeout(() => setShake(false), 500);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") attempt();
    if (wrong) setWrong(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAFAFA] px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <motion.div
        className="flex w-full max-w-[360px] flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.1 }}
      >
        <p className="text-serif-eyebrow text-[#0C0C12]">Confidential</p>

        <h1
          style={{
            fontFamily: "Ambit",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 40px)",
            letterSpacing: "-0.05em",
            lineHeight: 1.0,
            color: "#0C0C12",
          }}
        >
          This one&apos;s not
          <br />
          for everyone.
        </h1>

        <p className="text-body max-w-[280px] text-[#565656]">You know the word.</p>

        <motion.div
          className="mt-2 flex w-full flex-col gap-3"
          animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.45 }}
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (wrong) setWrong(false);
              }}
              onKeyDown={handleKey}
              placeholder={value.length === 0 ? "password" : ""}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full rounded-full border bg-transparent px-5 py-3 text-center font-sans text-[15px] placeholder-[#C0C0C0] transition-colors duration-200 outline-none"
              style={{
                borderColor: wrong ? "#E63929" : "#E0E0E0",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                caretColor: "#0C0C12",
              }}
            />
            {value.length > 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-[5px]">
                <AnimatePresence initial={false}>
                  {Array.from({ length: Math.min(value.length, 20) }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#0C0C12]"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          <motion.button
            onClick={attempt}
            className="w-full rounded-full py-3 font-sans text-[14px] font-medium tracking-[-0.28px] text-white"
            style={{ background: "#0C0C12" }}
            whileHover={{ opacity: 0.82 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Unlock
          </motion.button>
          <div style={{ height: 12 }} />
          <button
            onClick={() => router.back()}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#2E2E2E]/15 py-3 font-sans text-[14px] font-medium tracking-[-0.28px] text-[#2E2E2E] transition-colors duration-200 hover:border-[#2E2E2E]/40 hover:text-[#0C0C12]"
          >
            <ArrowLeft />
            Back
          </button>
          <AnimatePresence>
            {wrong && (
              <motion.p
                className="text-center font-sans text-[13px] tracking-[-0.25px] text-[#E63929]"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                That&apos;s not it.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

const GXM_OVERVIEW_SLUG = "gxm";
const GXM_PART1_SLUG = "gxm-building-alignment-before-software";
const GXM_PART2_SLUG = "gxm-validate-before-you-build";
const GXM_PART3_SLUG = "gxm-design-system-brand-foundations";

export default function CaseTemplate({ caseData }: { caseData: CaseData }) {
  const [unlocked, setUnlocked] = useState(false);
  const storedUnlock = useSyncExternalStore(
    noopSubscribe,
    () => sessionStorage.getItem(SESSION_KEY) === "1",
    () => false,
  );
  useEffect(() => {
    track("case_study_opened", {
      slug: caseData.slug,
      client: caseData.client,
      title: caseData.title.replace(/\n/g, " "),
    });
  }, [caseData.slug, caseData.client, caseData.title]);

  const isGXMOverview = caseData.slug === GXM_OVERVIEW_SLUG;

  const isGXMPart =
    caseData.slug === GXM_PART1_SLUG ||
    caseData.slug === GXM_PART2_SLUG ||
    caseData.slug === GXM_PART3_SLUG;

  const GXM_PART_SLUGS = [GXM_PART1_SLUG, GXM_PART2_SLUG, GXM_PART3_SLUG];
  const currentPartIndex = GXM_PART_SLUGS.indexOf(caseData.slug);
  const nextPartSlug =
    currentPartIndex >= 0 && currentPartIndex < GXM_PART_SLUGS.length - 1
      ? GXM_PART_SLUGS[currentPartIndex + 1]
      : null;

  return (
    <article>
      {/* Password gate — GXM overview only */}
      {isGXMOverview && !unlocked && !storedUnlock && (
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      )}

      {/* White page-entry fade — prevents the black flash from IntroLoader and gives a clean entrance */}
      <motion.div
        className="pointer-events-none fixed inset-0 bg-white"
        style={{ zIndex: 9998 }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      />
      <CaseHero caseData={caseData} />

      {/* Opaque wrapper so the global liquid wave doesn't bleed into content sections.
          paddingTop: 210 on desktop compensates for the image strip. Mobile gets 0 (strip is desktop-only). */}
      <div
        className={(caseData.heroImages?.length ?? 0) > 0 || caseData.heroImage ? "pt-[210px]" : ""}
        style={{ background: "#FAFAFA" }}
      >
        {caseData.sections.map((section, i) => (
          <CaseSectionBlock key={i} section={section} />
        ))}

        {isGXMPart && (
          <>
            <div
              className="snap-section flex flex-col items-center justify-center gap-5 px-8 text-center lg:px-[180px]"
              style={{ minHeight: "100svh" }}
            >
              <p className="text-serif-eyebrow text-[#0C0C12]">Go deeper</p>
              <h3 className="text-section-heading max-w-[640px] text-[#2E2E2E]">
                Every phase built on what the one before proved.
              </h3>
              <p className="text-body max-w-[400px] text-[#565656]">
                The product shipped because the thinking came first. Start with the decision that
                made all the others possible.
              </p>
              <a
                href={`/cases/${nextPartSlug ?? GXM_OVERVIEW_SLUG}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#0C0C12] px-6 py-2.5 font-sans text-[14px] font-medium tracking-[-0.28px] text-white transition-colors hover:bg-[#2E2E2E]"
              >
                {nextPartSlug ? "Continue with Next Phase" : "See the full story"}
                <ArrowUpRight />
              </a>
            </div>
            <ProjectsSection initialIndex={1} />
          </>
        )}
        {!isGXMOverview && !isGXMPart && <ProjectsSection initialIndex={0} />}
      </div>
    </article>
  );
}
