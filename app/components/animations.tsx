"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Single line reveal (inline use) ─────────────────────────────────────────
// Uses only <span> so it stays valid inside <h1>, <h2>, etc.
// pb/mb pair gives descenders (g, y, p) room so overflow-hidden doesn't clip them.
export function RevealLine({
  children,
  className = "",
  delay = 0,
  inView,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  inView: boolean;
}) {
  return (
    <span
      className="block overflow-hidden"
      style={{ paddingBottom: "0.15em", marginBottom: "-0.15em" }}
    >
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 0.85, ease, delay }}
      >
        <span className={className}>{children}</span>
      </motion.span>
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
