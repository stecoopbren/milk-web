"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Config ────────────────────────────────────────────────────────────────────
const SHOW_AFTER_SECTION = 2;

// ── Ring geometry — ring sits exactly on the button border ────────────────────
const BTN    = 56;                        // button diameter (px)
const STROKE = 2.5;
const R      = BTN / 2 - STROKE / 2;     // inset so stroke stays inside the circle
const CIRC   = 2 * Math.PI * R;

const ease = [0.22, 1, 0.36, 1] as const;

function smoothScrollTop() {
  // Route through the snap controller so it coordinates Lenis with lock:true.
  // Direct lenis.scrollTo() conflicts with the controller's onScrollEnd handler.
  window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { index: 0 } }));
}

export default function BackToTop() {
  const [visible,  setVisible]  = useState(false);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(maxScroll > 0 ? scrolled / maxScroll : 0);
    setVisible(scrolled > window.innerHeight * SHOW_AFTER_SECTION);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  const strokeOffset = CIRC * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => smoothScrollTop()}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full"
          style={{
            width: BTN, height: BTN,
            background: "#1a1a1a",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          whileHover={{ opacity: 0.82 }}
          whileTap={{ scale: 0.97 }}
          transition={{ default: { duration: 0.35, ease }, scale: { duration: 0.1 } }}
          aria-label="Back to top"
        >

          {/* Progress ring — same size as button, arc is the border */}
          <svg
            width={BTN}
            height={BTN}
            style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
          >
            {/* Faint track */}
            <circle
              cx={BTN / 2}
              cy={BTN / 2}
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={STROKE}
            />
            {/* Progress arc */}
            <circle
              cx={BTN / 2}
              cy={BTN / 2}
              r={R}
              fill="none"
              stroke="white"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={strokeOffset}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>

          {/* Arrow */}
          <svg
            className="relative"
            width="16" height="16" viewBox="0 0 16 16"
            fill="none" stroke="white" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M8 13V3M3 8l5-5 5 5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
