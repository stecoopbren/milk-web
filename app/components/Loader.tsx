"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const words = [
  "Hello",       // English
  "Bonjour",     // French
  "你好",         // Chinese
  "Hallo",       // German
  "Ciao",        // Italian
  "Hola",        // Spanish
  "Olá",         // Portuguese
  "こんにちは",    // Japanese
  "مرحبا",       // Arabic
  "Merhaba",     // Turkish
];

// Duration each word is visible (ms). Ramps up fast.
const durations = [660, 480, 350, 250, 180, 130, 100, 82, 72, 66];

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "logo-intro" | "words" | "vanish" | "logo" | "fadeout";

export default function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("logo-intro");
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // 1. Show white logo on dark background, then transition to words
    const t0 = setTimeout(() => {
      setPhase("words");

      const scheduleNextWord = (index: number) => {
        if (index >= words.length) {
          setPhase("vanish");
          const t1 = setTimeout(() => {
            setPhase("logo");
            const t2 = setTimeout(() => {
              setPhase("fadeout");
              const t3 = setTimeout(onDone, 1400);
              timeouts.push(t3);
            }, 4000);
            timeouts.push(t2);
          }, 500);
          timeouts.push(t1);
          return;
        }
        setWordIndex(index);
        const t = setTimeout(() => scheduleNextWord(index + 1), durations[index]);
        timeouts.push(t);
      };

      scheduleNextWord(0);
    }, 1600);

    timeouts.push(t0);
    return () => timeouts.forEach(clearTimeout);
  }, [onDone]);

  const isDark = phase === "logo-intro";

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center"
      animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
      transition={{ duration: 1.4, ease }}
      style={{ pointerEvents: phase === "fadeout" ? "none" : "auto" }}
    >
      {/* Light background — fades out during logo phase to reveal MilkBackground */}
      <motion.div
        className="absolute inset-0 bg-[#FAFAFA]"
        animate={{ opacity: phase === "logo" || phase === "fadeout" ? 0 : 1 }}
        transition={{ duration: 0.8, ease }}
      />

      {/* Dark overlay — covers light bg during logo-intro, then fades out */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            className="absolute inset-0 bg-[#0C0C12]"
            style={{ zIndex: 10 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          />
        )}
      </AnimatePresence>

      {/* ── Center — intro logo / words / end logo ── */}
      <div className="flex-1 flex items-center justify-center w-full relative" style={{ zIndex: 20 }}>

        {/* Intro: white Milk logo on dark background */}
        <AnimatePresence>
          {phase === "logo-intro" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <Image
                src="/MilkLogo-White.png"
                alt="Milk"
                width={280}
                height={72}
                style={{ width: 280, height: "auto" }}
                priority
              />
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

        {/* End: centered black logo with 3D effect */}
        <AnimatePresence>
          {phase === "logo" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease }}
              style={{ perspective: 900 }}
            >
              <motion.div
                animate={{
                  rotateX: [0, -2.5, 1, -1.5, 2, 0],
                  rotateY: [0, 4, -2, 3, -1, 0],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src="/MilkLogo-Black.png"
                  alt="Milk"
                  width={93}
                  height={24}
                  style={{
                    width: 93,
                    height: "auto",
                    filter: [
                      "drop-shadow(0 0 8px rgba(0,0,0,0.08))",
                      "drop-shadow(0 2px 6px rgba(0,0,0,0.12))",
                      "drop-shadow(2px 0px 1px rgba(255,60,60,0.15))",
                      "drop-shadow(-2px 0px 1px rgba(60,100,255,0.15))",
                    ].join(" "),
                  }}
                  priority
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── Bottom logo — visible during words, vanishes with them ── */}
      <AnimatePresence>
        {phase === "words" && (
          <motion.div
            className="mb-14"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            <Image
              src="/MilkLogo-Black.png"
              alt="Milk"
              width={93}
              height={24}
              style={{ width: 93, height: "auto" }}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
