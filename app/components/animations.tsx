"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Single line reveal (inline use) ─────────────────────────────────────────
// Uses only <span> so it stays valid inside <h1>, <h2>, etc.
// pb/mb pair gives descenders (g, y, p) room so overflow-hidden doesn't clip them.
export function RevealLine({
  children,
  className = "",
  delay = 0,
  inView: externalInView,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const selfInView = useInView(ref, { once: true, margin: "-60px" });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    document.fonts.load("600 1em tt-commons-pro")
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);
  const inView = ready && (externalInView !== undefined ? externalInView : selfInView);

  return (
    <span
      ref={ref}
      className="block"
      style={{ clipPath: "inset(-0.45em -999px -0.25em -999px)", visibility: ready ? "visible" : "hidden" }}
    >
      <motion.span
        className="block"
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.85, ease, delay }}
      >
        <span className={className}>{children}</span>
      </motion.span>
    </span>
  );
}

// ─── Word-by-word color reveal ────────────────────────────────────────────────
// Words start grey (#C0C0C0) and stagger to black (#0C0C12) when the element
// enters the viewport. Resets each time so it replays on every scroll visit.

export function ScrollColorText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "-10%" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={`block ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.22em] last:mr-0"
          animate={{ color: inView ? "#0C0C12" : "#C0C0C0" }}
          transition={{ duration: 0.5, delay: i * 0.04, ease }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Word blur reveal ─────────────────────────────────────────────────────────
// Splits text into words, each fades in with blur → sharp staggered.
// Usage: <BlurReveal text="..." className="..." delay={0.3} />

interface BlurRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurReveal({ text, className = "", delay = 0 }: BlurRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
          animate={
            inView
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : {}
          }
          transition={{
            duration: 0.6,
            ease,
            delay: delay + i * 0.04,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
