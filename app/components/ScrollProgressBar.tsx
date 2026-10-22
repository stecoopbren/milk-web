"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-[200] h-[3px] origin-left"
      style={{
        scaleX,
        background: "#111",
        transformOrigin: "0%",
      }}
    />
  );
}
