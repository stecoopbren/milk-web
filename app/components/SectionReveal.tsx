"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
  background?: React.ReactNode;
}

export default function SectionReveal({
  children,
  id,
  className = "",
  style,
  dark = false,
  background,
}: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);

  // Track scroll progress relative to this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth spring — lower stiffness + higher damping for a more fluid feel
  const smooth = useSpring(scrollYProgress, { stiffness: 38, damping: 22, restDelta: 0.001 });

  // Enter: fade + rise over a longer scroll window so it eases in gently
  const contentOpacity = useTransform(smooth, [0, 0.22], [0, 1]);
  const contentY      = useTransform(smooth, [0, 0.25], [28, 0]);
  const contentScale  = useTransform(smooth, [0, 0.22], [0.97, 1]);

  // Exit: start the white wash earlier and pair with a subtle scale-down
  const exitOpacity = useTransform(smooth, [0.68, 1], [0, 1]);
  const exitScale   = useTransform(smooth, [0.68, 1], [1, 0.96]);

  return (
    <section
      ref={ref}
      id={id}
      className={`snap-section relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      style={style}
    >
      {/* Optional background layer — rendered below scroll-animated content */}
      {background && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {background}
        </div>
      )}

      {/* Scroll-linked content reveal */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
      >
        {children}
      </motion.div>

      {/* Fade-to-white + scale-down as section exits — skip on dark footer */}
      {!dark && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: exitOpacity,
            scale: exitScale,
            background: "linear-gradient(to top, #FAFAFA 0%, #FAFAFA 30%, transparent 100%)",
          }}
        />
      )}
    </section>
  );
}
