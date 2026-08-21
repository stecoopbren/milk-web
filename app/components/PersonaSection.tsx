"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const lines = [
  { text: "I've worked across business, product, brand, research, and technology with teams at Google, Microsoft, Cisco, Meta, and beyond. I help teams figure out where they're going and make it real through strategy, research, design, and AI.", finalOpacity: 1 },
  { text: "10+ years across startups and Fortune 500 companies.", finalOpacity: 0.45 },
];

export default function PersonaSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="snap-section relative z-10 min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="w-full flex flex-col gap-4 px-8 lg:px-[180px]">
        {lines.map(({ text, finalOpacity }, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: finalOpacity, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.14 }}
            className="text-case-title text-[#0C0C12] w-full text-center"
          >
            {text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
