"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IDLE_MS = 10_000;

export default function ScrollCue() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const show = () => setVisible(true);
    const reset = () => {
      setVisible(false);
      clearTimeout(timer);
      timer = setTimeout(show, IDLE_MS);
    };

    timer = setTimeout(show, IDLE_MS);

    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("wheel", reset, { passive: true });
    window.addEventListener("touchmove", reset, { passive: true });
    window.addEventListener("keydown", reset, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("wheel", reset);
      window.removeEventListener("touchmove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Desktop: mouse outline */}
          <div className="hidden lg:flex flex-col items-center gap-2">
            <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="26" height="38" rx="13" stroke="#2E2E2E" strokeOpacity="0.35" strokeWidth="1.5" />
              <motion.rect
                x="12" y="8" width="4" height="7" rx="2"
                fill="#2E2E2E"
                fillOpacity="0.5"
                animate={{ y: [8, 18, 8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
            <span className="text-micro font-sans" style={{ color: "rgba(47,47,47,0.4)" }}>scroll</span>
          </div>

          {/* Mobile: bouncing chevron */}
          <div className="flex lg:hidden flex-col items-center gap-2">
            <motion.svg
              width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M4 7l6 6 6-6" stroke="#2E2E2E" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <span className="text-micro font-sans" style={{ color: "rgba(47,47,47,0.4)" }}>swipe</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
