"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Lottie from "lottie-react";
import { RevealLine } from "./animations";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

type Step = {
  id: number;
  label: string;
  step: string;
  title: string;
  body: string;
  animSrc: string;
  isCta?: boolean;
};

const steps: Step[] = [
  {
    id: 0,
    label: "DEFINE",
    step: "STEP 1 / DEFINE",
    title: "The full picture only comes from the whole room.",
    body: "The real problem rarely lives in one place. Map the business, surface the opportunity, agree on what needs to change. Then set the game plan everyone can move against.",
    animSrc: "/Formula/Distill.json",
  },
  {
    id: 1,
    label: "EXPERIMENT",
    step: "STEP 2 / EXPERIMENT",
    title: "The only way to know what works is to test it.",
    body: "Opinions don't reveal the truth. Experiments do. Fast, cheap, and often. Build the smallest test that gives the clearest answer.",
    animSrc: "/Formula/14.json",
  },
  {
    id: 2,
    label: "SHIP",
    step: "STEP 3 / SHIP",
    title: "Ship it. The real signal starts after launch.",
    body: "Define success before launch. Track the signals that matter. Feed what's learned back into the next cycle.",
    animSrc: "/Formula/04.json",
  },
];

const ctaCard: Step = {
  id: 3,
  label: "",
  step: "",
  title: "Want to learn more about the method?",
  body: "",
  animSrc: "/Formula/18.json",
  isCta: true,
};

// Mobile shows all 4 cards; desktop shows the 3 steps only
const mobileCards: Step[] = [...steps, ctaCard];

function useLottieAnim(src: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [anim, setAnim] = useState<any>(null);
  useEffect(() => {
    fetch(src).then(r => r.json()).then(setAnim).catch(() => {});
  }, [src]);
  return anim;
}

function MethodCard({
  step,
  index,
  isFlipped,
  onFlip,
  flipDelay = 0,
  inView,
}: {
  step: Step;
  index: number;
  isFlipped: boolean;
  onFlip: () => void;
  flipDelay?: number;
  inView: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");
  const anim = useLottieAnim(step.animSrc);
  const [hintState, setHintState] = useState<"idle" | "hinting" | "done">("idle");
  const hintScheduled = useRef(false);

  useEffect(() => {
    if (!inView || hintScheduled.current) return;
    hintScheduled.current = true;
    // Once committed, don't cancel — fires even if user briefly scrolls away
    setTimeout(() => {
      setHintState("hinting");
      setTimeout(() => setHintState("done"), 1000);
    }, 900 + flipDelay * 600);
  }, [inView]);

  const isHinting = hintState === "hinting" && !isFlipped;

  return (
    <div
      className="w-full h-full cursor-pointer select-none"
      style={{ perspective: "1200px" }}
      onClick={onFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : isHinting ? [0, 35, 0] : 0 }}
        whileHover={!isHinting && !isFlipped ? { rotateY: 30 } : {}}
        transition={
          isHinting
            ? { rotateY: { duration: 1.0, ease: "easeInOut", times: [0, 0.45, 1] } }
            : { rotateY: { duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: isFlipped ? flipDelay : 0 } }
        }
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-white border border-black/[0.07] rounded-2xl flex flex-col p-8"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="flex items-start justify-between w-full">
            <span className="text-ui text-[#0C0C12]">
              {step.label}
            </span>
            <span className="text-ui text-[#B0B0B0]">
              {num}
            </span>
          </div>

          <Lottie
            animationData={anim}
            loop
            className="flex-1 min-h-0 w-full"
          />
          <h3 className="text-subheading text-[#0C0C12] mt-5">
            {step.title}
          </h3>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-white border border-black/[0.07] rounded-2xl flex flex-col p-8 gap-4"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-start justify-between w-full">
            <span className="text-ui text-[#0C0C12]">
              {step.label}
            </span>
            <span className="text-ui text-[#B0B0B0]">
              {num}
            </span>
          </div>
          <p className="text-caption text-[#0C0C12]">
            {step.body}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Mobile single-card carousel ────────────────────────────────────────────

function MobileCarouselCard({
  step,
  num,
  flipped,
}: {
  step: Step;
  num: string;
  flipped: boolean;
}) {
  const anim = useLottieAnim(step.animSrc);

  if (step.isCta) {
    return (
      <div className="w-full h-full bg-white border border-black/[0.07] rounded-2xl flex flex-col items-center justify-between p-6 text-center">
        <Lottie animationData={anim} loop style={{ width: "100%", height: 180 }} />
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-subheading text-[#0C0C12]">{step.title}</h3>
          <button
            onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("milk:open-contact")); }}
            className="bg-[#0C0C12] text-white rounded-full px-6 py-2.5 font-sans font-medium text-[14px] tracking-[-0.3px]"
          >
            Let&apos;s talk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <AnimatePresence initial={false} mode="wait">
        {!flipped ? (
          <motion.div
            key="front"
            className="absolute inset-0 bg-white border border-black/[0.07] rounded-2xl flex flex-col p-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-start justify-between w-full shrink-0">
              <span className="text-ui text-[#0C0C12]">{step.label}</span>
              <span className="text-ui text-[#B0B0B0]">{num}</span>
            </div>
            <Lottie animationData={anim} loop className="flex-1 min-h-0 w-full" />
            <h3 className="text-subheading text-[#0C0C12] mt-4 shrink-0">
              {step.title}
            </h3>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            className="absolute inset-0 bg-white border border-black/[0.07] rounded-2xl flex flex-col p-6 gap-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-start justify-between w-full shrink-0">
              <span className="text-ui text-[#0C0C12]">{step.label}</span>
              <span className="text-ui text-[#B0B0B0]">{num}</span>
            </div>
            <p className="text-caption text-[#0C0C12]">
              {step.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CARD_W = 260;
const CARD_H = 344;

function useWindowSize() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

export default function MethodSection() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const inView = useInView(desktopRef, { once: false, margin: "-80px" });
  const mobileInView = useInView(mobileRef, { once: true, margin: "-80px" });
  const hasEntered = useRef(false);
  if (inView) hasEntered.current = true;
  const [cardFlips, setCardFlips] = useState(steps.map(() => false));
  const flipCard = (i: number) => setCardFlips(f => f.map((v, idx) => idx === i ? !v : v));
  const allFlipped = cardFlips.every(Boolean);
  const flipAll = () => setCardFlips(steps.map(() => !allFlipped));
  const [mobileActive, setMobileActive] = useState(0);
  const [mobileDir, setMobileDir] = useState(1);
  const [mobileFlipped, setMobileFlipped] = useState<number | null>(null);
  const { w, h } = useWindowSize();

  // ResizeObserver keeps cardTopBase in sync with the live text block height
  const [textBlockHeight, setTextBlockHeight] = useState(0);
  useEffect(() => {
    const el = textBlockRef.current;
    if (!el) return;
    const update = () => setTextBlockHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const goMobileNext = () => {
    if (mobileActive < mobileCards.length - 1) {
      setMobileDir(1);
      setMobileActive(a => a + 1);
      setMobileFlipped(null);
    }
  };
  const goMobilePrev = () => {
    if (mobileActive > 0) {
      setMobileDir(-1);
      setMobileActive(a => a - 1);
      setMobileFlipped(null);
    }
  };

  // Cards sit exactly 24px below the bottom of the text+button block
  // textBlockRef is absolute top-0, so offsetHeight = distance from section top to block bottom
  const cardTopBase = textBlockHeight > 0 ? textBlockHeight + 24 : Math.round(h * 0.52);
  const cardGap     = Math.round(w * 0.05); // 5vw between cards
  const totalSpan   = 3 * CARD_W + 2 * cardGap;
  const startLeft   = Math.round((w - totalSpan) / 2);
  const arc = [
    { left: startLeft,                          top: cardTopBase + 16, rotate: -14 },
    { left: startLeft +     (CARD_W + cardGap), top: cardTopBase,      rotate: 0   },
    { left: startLeft + 2 * (CARD_W + cardGap), top: cardTopBase + 16, rotate: 14  },
  ];

  return (
    <SectionReveal id="method" className="px-8 lg:px-0" noClip>

      {/* ── Mobile: header + one-card carousel ─────────────── */}
      <div
        ref={mobileRef}
        className="lg:hidden flex flex-col items-start justify-start w-full px-6"
        style={{ minHeight: "140svh", paddingTop: "108px", paddingBottom: "40px" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 w-full text-center items-center">
          <RevealLine
            className="text-serif-eyebrow text-[#0C0C12]"
            delay={0.1}
            inView={mobileInView}
          >
            The Milk Formula®
          </RevealLine>
          <h2 className="text-heading text-[#2E2E2E]">
            <RevealLine delay={0.25} inView={mobileInView}>No more guesswork.</RevealLine>
          </h2>
          <p className="text-body text-[#888] mt-1">Swipe to see the method.</p>
          <button
            onClick={() => setMobileFlipped(mobileFlipped === mobileActive ? null : mobileActive)}
            className={`mt-2 border border-[#2E2E2E]/20 rounded-full px-5 py-2 font-sans font-medium text-[13px] text-[#2E2E2E] tracking-[-0.3px] transition-colors hover:border-[#2E2E2E]/50 inline-flex items-center gap-2 ${mobileCards[mobileActive]?.isCta ? "invisible" : ""}`}
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: mobileFlipped === mobileActive ? "scaleX(-1)" : "scaleX(1)", transition: "transform 0.4s" }}
            >
              <path d="M23 4v6h-6"/>
              <path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {mobileFlipped === mobileActive ? "Face Down" : "Flip Card"}
          </button>
        </div>

        {/* One-card carousel */}
        <div className="relative w-full mt-6 overflow-hidden" style={{ height: "360px" }}>
          <AnimatePresence custom={mobileDir} mode="popLayout">
            <motion.div
              key={mobileActive}
              custom={mobileDir}
              variants={{
                enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 1 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 1 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if ((info.offset.x < -80 || info.velocity.x < -500) && mobileActive < mobileCards.length - 1) {
                  goMobileNext();
                } else if ((info.offset.x > 80 || info.velocity.x > 500) && mobileActive > 0) {
                  goMobilePrev();
                }
              }}
              className="absolute inset-0"
              style={{ cursor: "grab", touchAction: "pan-y" }}
              onTap={() => { if (!mobileCards[mobileActive]?.isCta) setMobileFlipped(mobileFlipped === mobileActive ? null : mobileActive); }}
            >
              <MobileCarouselCard
                step={mobileCards[mobileActive]}
                num={String(mobileActive + 1).padStart(2, "0")}
                flipped={!mobileCards[mobileActive]?.isCta && mobileFlipped === mobileActive}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav buttons (left) + progress dots (right) */}
        <div className="flex items-center justify-between w-full mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={goMobilePrev}
              disabled={mobileActive === 0}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 disabled:opacity-30 transition-colors"
              aria-label="Previous card"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={goMobileNext}
              disabled={mobileActive === mobileCards.length - 1}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 disabled:opacity-30 transition-colors"
              aria-label="Next card"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 items-center">
            {mobileCards.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setMobileDir(i > mobileActive ? 1 : -1);
                  setMobileActive(i);
                  setMobileFlipped(null);
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === mobileActive ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop: radial cards + centered text ──── */}
      <div
        ref={desktopRef}
        className="hidden lg:block relative w-full"
        style={{ height: "100svh" }}
      >
        {/* Arc cards — thrown in from below on enter */}
        {(() => {
          const throwFrom = [
            { x: -40, y: 500, rotate: -28 },
            { x:   0, y: 500, rotate:   0 },
            { x:  40, y: 500, rotate:  28 },
          ];
          return steps.map((s, i) => (
          <motion.div
            key={s.id}
            className="absolute w-[260px] h-[344px]"
            style={{ left: arc[i].left, top: arc[i].top }}
            initial={{ opacity: 0, x: throwFrom[i].x, y: throwFrom[i].y, rotate: throwFrom[i].rotate }}
            animate={
              inView
                ? { opacity: 1, x: 0, y: 0, rotate: arc[i].rotate }
                : hasEntered.current
                  ? { opacity: 0, x: throwFrom[i].x, y: throwFrom[i].y * 0.5, rotate: throwFrom[i].rotate }
                  : { opacity: 0, x: throwFrom[i].x, y: throwFrom[i].y, rotate: throwFrom[i].rotate }
            }
            transition={
              inView
                ? { type: "spring", stiffness: 72, damping: 13, mass: 1.1, delay: 0.05 + i * 0.1 }
                : { duration: 0.45, ease: [0.4, 0, 1, 1], delay: i * 0.05 }
            }
          >
            <MethodCard
              step={s}
              index={i}
              isFlipped={cardFlips[i]}
              onFlip={() => flipCard(i)}
              flipDelay={i * 0.18}
              inView={inView}
            />
          </motion.div>
          ));
        })()}

        {/* Top: label + heading + button */}
        <div ref={textBlockRef} className="absolute top-0 left-0 right-0 flex flex-col items-center text-center z-10" style={{ paddingTop: "16vh" }}>
          <div className="pointer-events-none">
            <RevealLine
              className="text-serif-eyebrow text-[#0C0C12]"
              delay={0.1}
              inView={inView}
            >
              The Milk Formula®
            </RevealLine>
            <h2 className="text-heading text-[#2E2E2E] mt-3" style={{ paddingBottom: "0.35em" }}>
              <RevealLine delay={0.25} inView={inView}>Three Steps.</RevealLine>
              <RevealLine delay={0.38} inView={inView}>No more guesswork.</RevealLine>
            </h2>
          </div>
          <motion.button
            onClick={flipAll}
            className="mt-6 relative border border-[#2E2E2E]/20 rounded-full px-5 py-2 font-sans font-medium text-[13px] text-[#2E2E2E] tracking-[-0.3px] transition-colors hover:border-[#2E2E2E]/50 inline-flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              animate={{ scaleX: allFlipped ? -1 : 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <path d="M23 4v6h-6"/>
              <path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </motion.svg>
            {allFlipped ? "Face Down" : "Flip the Deck"}
          </motion.button>
        </div>

      </div>

    </SectionReveal>
  );
}
