"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Line Mask Reveal ─────────────────────────────────────────────────────────
// Wraps each line in overflow-hidden so the text slides up from behind a mask.
// Usage: <RevealLines lines={["We turn", "big ideas"]} className="..." delay={0.2} />

interface RevealLinesProps {
  lines: (string | React.ReactNode)[];
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function RevealLines({
  lines,
  className = "",
  delay = 0,
  stagger = 0.1,
  as: Tag = "span",
}: RevealLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.div
            initial={{ y: "105%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{
              duration: 0.85,
              ease,
              delay: delay + i * stagger,
            }}
          >
            <Tag className={className}>{line}</Tag>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

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

// ─── Cycling Word ─────────────────────────────────────────────────────────────
// Vertical ticker — old word slides up out, new word slides up in from below.
// Usage: <CyclingWord words={["businesses", "products"]} className="..." />

interface CyclingWordProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function CyclingWord({
  words,
  className = "",
  interval = 2200,
}: CyclingWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(t);
  }, [words, interval]);

  // Find the longest word to keep width stable
  const longest = words.reduce((a, b) => (a.length > b.length ? a : b));

  return (
    <span
      className="relative inline-block overflow-hidden align-bottom"
      style={{ paddingBottom: "0.15em", marginBottom: "-0.15em" }}
    >
      {/* Invisible longest word keeps the container width stable */}
      <span className={`${className} invisible select-none`} aria-hidden>
        {longest}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className={`${className} absolute left-0 bottom-0`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
