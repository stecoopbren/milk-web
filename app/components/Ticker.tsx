"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface TickerProps {
  id?: string;
  lines: string[];
  suffix?: React.ReactNode; // rendered after the first line
}

export default function Ticker({ id, lines, suffix }: TickerProps) {
  const n = lines.length;
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIndex(Math.min(n - 1, Math.floor(v * n)));
  });

  return (
    <div
      id={id}
      ref={outerRef}
      style={{ position: "relative", height: `${n * 100}vh` }}
    >
      {lines.map((_, i) => (
        <div
          key={`snap-${i}`}
          className="snap-section"
          style={{
            position: "absolute",
            top: `${i * 100}vh`,
            height: "1px",
            width: "100%",
            pointerEvents: "none",
            visibility: "hidden",
          }}
        />
      ))}

      <div className="sticky top-0 h-screen flex items-center justify-center px-8 lg:px-[180px]">
        <AnimatePresence mode="wait">
          <motion.h2
            key={activeIndex}
            className="font-sans font-medium tracking-[-3.2px] leading-[0.95] w-full whitespace-pre-line text-center"
            style={{ fontSize: "clamp(36px, 5.5vw, 56px)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.45, ease }}
          >
            {lines[activeIndex]}
            {activeIndex === 0 && suffix}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  );
}
