"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

let introHasShown = false;

const LOGO_DURATION   = 4200; // ms the logo is visible
const COUNT_DURATION  = 2400; // ms for the counting animation
const REVEAL_DURATION = 2500; // ms the black logo is shown over the background

const ease = [0.22, 1, 0.36, 1] as const;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function IntroLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"logo" | "logo-exit" | "counting" | "logo-reveal" | "outro">("logo");
  const [count, setCount] = useState(0);
  const [done, setDone]   = useState(false);
  const numbersRef        = useRef<HTMLDivElement>(null);

  // ── CMD+Shift+R — reset intro so it plays again on hard refresh ────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "r") {
        sessionStorage.removeItem("milk:intro-shown");
        introHasShown = false;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Logo phase ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Only play on the homepage
    if (pathname !== "/") {
      setTimeout(() => window.dispatchEvent(new CustomEvent("milk:intro-exit")), 50);
      setDone(true);
      return;
    }
    // Client-only: skip if already shown this browser session
    if (introHasShown || sessionStorage.getItem("milk:intro-shown")) {
      // Defer so sibling components (HeroSection) can mount and register their listeners first
      setTimeout(() => window.dispatchEvent(new CustomEvent("milk:intro-exit")), 50);
      setDone(true);
      return;
    }
    introHasShown = true;

    const t = setTimeout(() => setPhase("logo-exit"), LOGO_DURATION);
    return () => clearTimeout(t);
  }, []);

  // ── Counting phase ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "counting") return;

    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t     = Math.min((now - start) / COUNT_DURATION, 1);
      const eased = easeInOutCubic(t);

      if (numbersRef.current) {
        numbersRef.current.style.transform = `scale(${1 + eased * 16}) translateZ(0)`;
      }

      setCount(Math.floor(eased * 100));

      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCount(100);
        sessionStorage.setItem("milk:intro-shown", "1");
        setPhase("logo-reveal");
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // ── Logo reveal phase ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "logo-reveal") return;
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("milk:intro-exit"));
      setPhase("outro");
      setTimeout(() => setDone(true), 1100);
    }, REVEAL_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center"
      animate={{ opacity: phase === "outro" ? 0 : 1 }}
      transition={{ duration: 1.0, ease }}
    >
      {/* Dark background — fades out during logo-reveal to expose LiquidBackground */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{ opacity: (phase === "logo-reveal" || phase === "outro") ? 0 : 1 }}
        transition={{ duration: 0.9, ease }}
      />

      {/* ── White Logo ── */}
      <AnimatePresence onExitComplete={() => setPhase("counting")}>
        {phase === "logo" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/MilkLogo-White.png"
              alt="Milk"
              style={{ width: "clamp(70px, 8vw, 130px)", display: "block" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Counter ── */}
      <AnimatePresence>
        {phase === "counting" && (
          <motion.div
            ref={numbersRef}
            className="select-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            style={{
              fontSize: 200,
              fontFamily: "Ambit, sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 1,
              color: "white",
              willChange: "transform",
            }}
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Black Logo Reveal ── */}
      <img
        src="/MilkLogo-Black.png"
        alt="Milk"
        style={{
          width: "clamp(70px, 8vw, 130px)",
          display: "block",
          position: "absolute",
          opacity: phase === "logo-reveal" ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 0.45s",
        }}
      />
    </motion.div>
  );
}
