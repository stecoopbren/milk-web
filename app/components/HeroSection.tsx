"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function TypewriterWord({ word, longest, animated }: { word: string; longest: string; animated: boolean }) {
  const [display, setDisplay] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevWord = useRef(word);
  const initialTyped = useRef(false);

  // Type the first word in when the hero reveals
  useEffect(() => {
    if (!animated || initialTyped.current) return;
    initialTyped.current = true;
    setIsTyping(true);
    let typed = "";
    const id = setInterval(() => {
      typed = word.slice(0, typed.length + 1);
      setDisplay(typed);
      if (typed === word) { clearInterval(id); setIsTyping(false); }
    }, 90);
    return () => clearInterval(id);
  }, [animated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Erase old word, type new word on subsequent cycles
  useEffect(() => {
    if (!initialTyped.current) return;
    if (prevWord.current === word) return;

    const oldWord = prevWord.current;
    prevWord.current = word;
    let current = oldWord;
    setIsTyping(true);

    const eraseId = setInterval(() => {
      current = current.slice(0, -1);
      setDisplay(current);
      if (current.length === 0) {
        clearInterval(eraseId);
        let typed = "";
        const typeId = setInterval(() => {
          typed = word.slice(0, typed.length + 1);
          setDisplay(typed);
          if (typed === word) { clearInterval(typeId); setIsTyping(false); }
        }, 90);
      }
    }, 70);

    return () => clearInterval(eraseId);
  }, [word]);

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      {/* Ghost spacer — always holds the width of the longest word so the line never reflows */}
      <span style={{ visibility: "hidden", userSelect: "none", pointerEvents: "none" }}>{longest}</span>
      {/* Visible typewriter text + cursor, centered within the spacer */}
      <span style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", whiteSpace: "nowrap" }}>
        {display}
        {animated && (
          <motion.span
            animate={isTyping ? { opacity: 1 } : { opacity: [1, 0, 1] }}
            transition={isTyping ? {} : { duration: 0.9, repeat: Infinity, ease: "linear", times: [0, 0.5, 1] }}
            style={{ display: "inline-block", marginLeft: "0.04em", fontWeight: "inherit" }}
          >|</motion.span>
        )}
      </span>
    </span>
  );
}
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;
// Resets on hard refresh (module re-evaluates), survives soft nav (module stays cached)
let heroHasPlayed = false;

const logos = [
  { src: "/logo-google.svg",               alt: "Google",      height: 22 },
  { src: "/logo-meta.svg",                 alt: "Meta",        height: 20 },
  { src: "/logo-microsoft.svg",            alt: "Microsoft",   height: 20 },
  { src: "/Cisco_logo_blue_2016.svg.png",  alt: "Cisco",       height: 24 },
  { src: "/logo-stripe.svg",               alt: "Stripe",      height: 22 },
  { src: "/accenture-transparent.webp",    alt: "Accenture",   height: 22 },
  { src: "/NIQ_logo.png",                  alt: "NIQ",         height: 22 },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const logoEls = useRef<HTMLSpanElement[]>([]);

  // Spotlight: logo closest to container center gets full opacity, rest faded
  useEffect(() => {
    logoEls.current = [];
  }, []);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      if (containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const centerX = cRect.left + cRect.width / 2;

        let minDist = Infinity;
        let best: HTMLSpanElement | null = null;

        for (const el of logoEls.current) {
          const r = el.getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - centerX);
          if (dist < minDist) { minDist = dist; best = el; }
        }

        // Continuous scale — each logo grows/shrinks smoothly based on distance from center
        for (const el of logoEls.current) {
          const r = el.getBoundingClientRect();
          const elCenterX = r.left + r.width / 2;
          const dist = Math.abs(elCenterX - centerX);
          const t = Math.min(dist / (cRect.width * 0.35), 1);
          const scale = 1.18 - t * 0.18; // 1.18 at center → 1.0 at edge
          const opacity = 1 - t * 0.8;   // 1.0 at center → 0.2 at edge
          el.style.opacity = String(opacity);
          el.style.transform = `scale(${scale})`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  // Animate after intro loader exits. Stays true during soft nav so it doesn't replay.
  const [animated, setAnimated] = useState(heroHasPlayed);
  useEffect(() => {
    if (heroHasPlayed) return;
    const onIntroExit = () => {
      // Small delay so the loader's white fade-out has started
      const t = setTimeout(() => {
        setAnimated(true);
        heroHasPlayed = true;
      }, 300);
      return () => clearTimeout(t);
    };
    window.addEventListener("milk:intro-exit", onIntroExit, { once: true });
    return () => window.removeEventListener("milk:intro-exit", onIntroExit);
  }, []);

  // ── Scroll-driven animations ──────────────────────────────────────────────
  const { scrollY } = useScroll();
  const contentOpacity = useTransform(scrollY, [0, 1200], [1, 0]);

  const cycleWords = ["They move smarter.", "They know their market.", "They build with clarity."];
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    if (!animated) return;
    const id = setInterval(() => setWordIndex(i => (i + 1) % cycleWords.length), 4000);
    return () => clearInterval(id);
  }, [animated]);



  return (
    <SectionReveal
      id="home"
      noExitBlur
      noClip
      className="px-8 lg:px-[40px] pt-[92px]"
    >
      {/* ── Content ── */}
      <motion.div
        ref={ref}
        className="flex flex-col items-center text-center gap-6 w-full"
        style={{ position: "relative", zIndex: 1, opacity: contentOpacity }}
      >

        {/* Headline */}
        <div className="flex flex-col items-center w-full text-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <h1 className="text-display text-[#2E2E2E] text-center text-[64px] lg:text-[152px]" style={{ fontFamily: "Ambit" }}>
              Don&apos;t move faster,<br />move smarter.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.72 }}
          >
            <div className="text-[#2E2E2E]" style={{ fontFamily: "Ambit", fontWeight: 700, fontSize: "clamp(22px, 3vw, 56px)", letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              <TypewriterWord word={cycleWords[wordIndex]} longest="They know their market." animated={animated} />
            </div>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={animated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.0, ease, delay: 0.78 }}
        >
          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent("milk:open-contact"))}
            className="inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium text-[15px] text-white tracking-[-0.45px] w-[148px] transition-opacity hover:opacity-80"
            style={{ background: "#111", padding: "12px 20px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Let&apos;s Talk
          </motion.button>

          <motion.button
            onClick={() => window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { id: "portfolio" } }))}
            className="border border-[#2E2E2E]/15 rounded-full py-[11px] font-sans font-medium text-[15px] text-[#2E2E2E] tracking-[-0.45px] inline-flex items-center justify-center gap-2 hover:border-[#2E2E2E]/40 transition-colors w-[148px]"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            View Work
          </motion.button>
        </motion.div>

        {/* Logos marquee */}
        <motion.div
          className="w-full flex flex-col items-center gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 2.2, ease, delay: 1.05 }}
        >
          <p style={{ fontFamily: "Ambit", fontWeight: 600, fontSize: "22px", letterSpacing: "-0.88px", lineHeight: 0.9 }} className="text-[#B0B0B0]">
            Trusted by teams at
          </p>

          <div
            ref={containerRef}
            className="relative mx-auto overflow-hidden"
            style={{ width: 360, paddingBlock: "20px" }}
          >
            {/* Edge fade */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: "linear-gradient(to right, #FFFFFF 0%, transparent 28%, transparent 72%, #FFFFFF 100%)" }} />
            <div className="marquee-track flex" style={{ width: "max-content" }}>
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center shrink-0" style={{ gap: "2.5rem", paddingRight: "2.5rem" }}>
                  {logos.map((logo, i) => (
                    <span
                      key={i}
                      ref={el => { if (el) logoEls.current.push(el); }}
                      className="shrink-0 flex items-center"
                      style={{ filter: "brightness(0)", opacity: 0.2, transition: "opacity 0.25s ease, transform 0.25s ease" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        style={{ width: "auto", height: logo.height }}
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </motion.div>


      </motion.div>



      {/* Bottom gradient — reinforces fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "35%",
          background: "linear-gradient(to bottom, transparent, #FFFFFF)",
          zIndex: 1,
        }}
      />

    </SectionReveal>
  );
}
