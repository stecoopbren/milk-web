"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export default function SceneTransition() {
  const controls = useAnimation();

  useEffect(() => {
    const onStart = () => {
      controls.start({
        opacity: 1,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      });
    };
    const onEnd = () => {
      controls.start({
        opacity: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      });
    };

    window.addEventListener("milk:snap-start", onStart);
    window.addEventListener("milk:snap-end", onEnd);
    return () => {
      window.removeEventListener("milk:snap-start", onStart);
      window.removeEventListener("milk:snap-end", onEnd);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 150,
        backdropFilter: "blur(14px) brightness(0.96) saturate(0.9)",
        WebkitBackdropFilter: "blur(14px) brightness(0.96) saturate(0.9)",
      }}
      initial={{ opacity: 0 }}
      animate={controls}
    />
  );
}
