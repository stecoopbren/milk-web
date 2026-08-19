"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

let introHasShown = false;

const words = [
  "Hello",
  "Bonjour",
  "你好",
  "Hallo",
  "Ciao",
  "Hola",
  "Olá",
  "こんにちは",
  "مرحبا",
  "Merhaba",
];
const durations = [660, 480, 350, 250, 180, 130, 100, 82, 72, 66];

const ease = [0.22, 1, 0.36, 1] as const;

export default function IntroLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [phase, setPhase] = useState<"logo-intro" | "words" | "vanish" | "logo-reveal" | "outro">("logo-intro");
  const [wordIndex, setWordIndex] = useState(0);
  const [done, setDone] = useState(() => !isHome);
  const outroFiredRef = useRef(false);

  // ── CMD+Shift+R — reset intro ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "r") {
        sessionStorage.removeItem("milk:intro-shown");
        introHasShown = false;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Guard: non-home or already seen ───────────────────────────────────────
  useEffect(() => {
    if (pathname !== "/") {
      setTimeout(() => window.dispatchEvent(new CustomEvent("milk:intro-exit")), 50);
      setDone(true);
      return;
    }
    if (introHasShown || sessionStorage.getItem("milk:intro-shown")) {
      setTimeout(() => window.dispatchEvent(new CustomEvent("milk:intro-exit")), 50);
      setDone(true);
      return;
    }
    introHasShown = true;

    // After logo-intro, cycle words
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const t0 = setTimeout(() => {
      setPhase("words");
      const scheduleNext = (i: number) => {
        if (i >= words.length) {
          setPhase("vanish");
          const t1 = setTimeout(() => {
            setPhase("logo-reveal");
            sessionStorage.setItem("milk:intro-shown", "1");
            const t2 = setTimeout(() => {
              outroFiredRef.current = true;
              setPhase("outro");
            }, 2800);
            timeouts.push(t2);
          }, 400);
          timeouts.push(t1);
          return;
        }
        setWordIndex(i);
        const t = setTimeout(() => scheduleNext(i + 1), durations[i]);
        timeouts.push(t);
      };
      scheduleNext(0);
    }, 1600);

    timeouts.push(t0);
    return () => {
      timeouts.forEach(clearTimeout);
      introHasShown = false;
    };
  }, []);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "outro" ? 0 : 1 }}
      transition={{ duration: 1.0, ease }}
      onAnimationComplete={() => {
        if (!outroFiredRef.current) return;
        outroFiredRef.current = false;
        setDone(true);
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            window.dispatchEvent(new CustomEvent("milk:intro-exit"))
          )
        );
      }}
    >
      {/* Light background */}
      <motion.div
        className="absolute inset-0 bg-[#FAFAFA]"
        animate={{ opacity: phase === "logo-reveal" || phase === "outro" ? 0 : 1 }}
        transition={{ duration: 0.8, ease }}
      />

      {/* Dark overlay — logo-intro only */}
      <AnimatePresence>
        {phase === "logo-intro" && (
          <motion.div
            className="absolute inset-0 bg-[#0C0C12]"
            style={{ zIndex: 10 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          />
        )}
      </AnimatePresence>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center w-full relative" style={{ zIndex: 20 }}>

        {/* White logo on dark */}
        <AnimatePresence>
          {phase === "logo-intro" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/MilkLogo-White.png" alt="Milk" style={{ width: "clamp(70px, 8vw, 130px)", display: "block" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cycling words */}
        <AnimatePresence mode="sync">
          {phase === "words" && (
            <motion.p
              key={wordIndex}
              className="absolute text-[#0C0C12]"
              style={{ fontFamily: "Ambit", fontWeight: 700, fontSize: "clamp(40px, 7vw, 80px)", letterSpacing: "-2.5px", lineHeight: 1 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.14, ease }}
            >
              {words[wordIndex]}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Black logo reveal */}
        <AnimatePresence>
          {phase === "logo-reveal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              style={{ perspective: 900 }}
            >
              <motion.div
                animate={{ rotateX: [0, -2.5, 1, -1.5, 2, 0], rotateY: [0, 4, -2, 3, -1, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/MilkLogo-Black.png" alt="Milk" style={{ width: "clamp(70px, 8vw, 130px)", display: "block" }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </motion.div>
  );
}
