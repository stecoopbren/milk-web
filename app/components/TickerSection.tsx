"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import MultiplayerCursors from "./MultiplayerCursors";

const ease = [0.22, 1, 0.36, 1] as const;

const textStyle = {
  fontSize: "clamp(48px, 7vw, 88px)" as const,
  letterSpacing: "-0.055em",
};

// ── ScrollWord: color transitions from gray → dark as scroll progresses ───────
function ScrollWord({
  word, index, total, progress,
}: {
  word: string; index: number; total: number; progress: MotionValue<number>;
}) {
  const phaseStart = -0.75;
  const phaseEnd   = 0.75;
  const start = phaseStart + (index / total) * (phaseEnd - phaseStart);
  const end   = phaseStart + ((index + 1) / total) * (phaseEnd - phaseStart);
  const color = useTransform(progress, [start, end], ["#C0C0C0", "#0C0C12"]);
  return <motion.span style={{ color, display: "inline" }}>{word}</motion.span>;
}

// ── FireIcon: static inline, sits between scroll-revealed words ───────────────
function FireIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/fire-icon.svg"
      alt=""
      aria-hidden
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        height: "0.8em",
        width: "auto",
        marginInline: "0.1em",
        opacity: 1,
      }}
    />
  );
}

// ── Desktop: 200vh sticky section with scroll-reveal ─────────────────────────
function DesktopSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Only "BEEN THERE BEFORE.." (3 words) scroll-reveal from gray → black
  const revealWords = ["been", "there", "BEFORE.."];

  // Eyebrow is always visible — no scroll-gated opacity
  const eyebrowOpacity = 1;
  const eyebrowY       = 0;

  return (
    <div
      ref={outerRef}
      className="hidden lg:block snap-section"
      data-free-scroll="true"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-[180px] text-center overflow-hidden">
        <MultiplayerCursors />

        <div className="flex flex-col items-center gap-6 relative" style={{ zIndex: 1 }}>
          {/* Eyebrow */}
          <motion.p
            style={{ opacity: eyebrowOpacity, y: eyebrowY, fontFamily: "Ambit" }}
            className="text-serif-eyebrow text-[#0C0C12]"
          >
            I understand... Let&apos;s be honest.
          </motion.p>

          {/* Headline with scroll-reveal */}
          <h2
            className="text-display leading-[0.9] text-center text-[#0C0C12]"
          >
            {/* First line — always black */}
            We have all
            <br />
            {/* Second line — scroll-reveal gray → black */}
            {revealWords.map((word, i) => (
              <span key={word}>
                <ScrollWord word={word} index={i} total={revealWords.length} progress={scrollYProgress} />
                {i < revealWords.length - 1 && " "}
              </span>
            ))}
          </h2>
        </div>
      </div>
    </div>
  );
}

// ── Mobile: single screen, static dark text ───────────────────────────────────
function MobileSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <div ref={ref} className="lg:hidden snap-section h-screen flex items-center justify-center px-8 relative">
      <MultiplayerCursors mobile />

      <div className="flex flex-col items-center gap-4 text-center relative" style={{ zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-serif-eyebrow text-[#0C0C12]"
          style={{ fontFamily: "Ambit" }}
        >
          I understand... Let&apos;s be honest.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="text-display text-[#0C0C12] leading-[0.9] text-center text-[64px] lg:text-[172px]"
        >
          We have all
          <br />
          been there BEFORE..
        </motion.h2>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TickerSection() {
  return (
    <>
      <MobileSection />
      <DesktopSection />
    </>
  );
}
