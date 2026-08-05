"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
  noClip?: boolean;
  noExitBlur?: boolean;
  background?: React.ReactNode;
}

export default function SectionReveal({
  children,
  id,
  className = "",
  style,
  dark = false,
  noClip = false,
  noExitBlur = false,
  background,
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  // Tracks the last viewport-height of the section — works for any section height
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });

  const exitFilter  = useTransform(scrollYProgress, [0, 0.65], ["blur(0px)",  "blur(16px)"]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      id={id}
      data-dark={dark ? "true" : undefined}
      className={`snap-section relative z-10 min-h-screen flex items-center justify-center ${noClip ? "" : "overflow-hidden"} ${dark ? "bg-[#1F1F20]" : ""} ${className}`}
      style={style}
    >
      {background && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {background}
        </div>
      )}

      {/* Exit blur wrapper — scroll-driven, fully reversible */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        style={noExitBlur ? undefined : { filter: exitFilter, opacity: exitOpacity }}
      >
        {/* Entrance fade */}
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease, delay: 0.05 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
