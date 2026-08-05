"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";
import Image from "next/image";
import { RevealLine } from "@/app/components/animations";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import SectionReveal from "@/app/components/SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Section 1: Editorial Hero ─────────────────────────────────────────────────
const p2Words = "Not the tricks. The moment someone's reality shifted.".split(" ");
const p3Words = "The idea that what looks impossible is just a problem waiting to be understood. That never left me.".split(" ");

function ScrollWord({
  word, progress, idx, total, fromProgress, toProgress,
}: {
  word: string; progress: MotionValue<number>; idx: number; total: number;
  fromProgress: number; toProgress: number;
}) {
  const span = (toProgress - fromProgress) / total;
  const color = useTransform(
    progress,
    [fromProgress + idx * span, fromProgress + (idx + 1) * span],
    ["#C0C0C0", "#2E2E2E"]
  );
  return (
    <motion.span style={{ color }} className="inline-block mr-[0.22em] last:mr-0">
      {word}
    </motion.span>
  );
}

const phaseFade = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

function HeroSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const inView   = useInView(outerRef, { once: true });
  const [phase, setPhase] = useState<1 | 2 | 3>(1);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.30) setPhase(1);
    else if (v < 0.60) setPhase(2);
    else setPhase(3);
  });

  return (
    <div
      ref={outerRef}
      className="snap-section relative"
      data-free-scroll="true"
      style={{ height: "500vh", scrollSnapAlign: "none" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#FFFFFF]">
        <AnimatePresence mode="sync" initial={false}>

          {phase === 1 && (
            <motion.div
              key="p1"
              className="absolute inset-0 flex items-center justify-center px-8"
              style={{ paddingTop: "68px" }}
              exit={{ opacity: 0 }}
              transition={phaseFade}
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20 max-w-[1000px] w-full">
                <motion.div
                  className="shrink-0 w-[200px] lg:w-[340px] rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 440, x: -30, rotate: -14 }}
                  animate={inView ? { opacity: 1, y: 0, x: 0, rotate: -2 } : {}}
                  transition={{ type: "spring", stiffness: 72, damping: 13, mass: 1.1 }}
                >
                  <Image
                    src="/headshots/mekid.webp"
                    alt="Steven Cooper"
                    width={340}
                    height={510}
                    className="w-full h-auto"
                    priority
                  />
                </motion.div>

                <div className="flex flex-col justify-center">
                  <motion.span
                    className="font-mono text-[13px] tracking-[-0.39px] text-[#565656] mb-5 block"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, ease, delay: 0.2 }}
                  >
                    The Story
                  </motion.span>
                  <h1
                    className="font-sans font-medium tracking-[-2.5px] leading-[0.92] text-[#2E2E2E]"
                    style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
                  >
                    <RevealLine inView={inView} delay={0.35}>When I was a child,</RevealLine>
                    <RevealLine inView={inView} delay={0.50}>I was obsessed</RevealLine>
                    <RevealLine inView={inView} delay={0.65}>with magic.</RevealLine>
                  </h1>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 2 && (
            <motion.div
              key="p2"
              className="absolute inset-0 flex items-center justify-center px-8 lg:px-[180px]"
              style={{ paddingTop: "68px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={phaseFade}
            >
              <p
                className="font-sans font-medium tracking-[-2px] leading-[0.95] max-w-[860px] w-full"
                style={{ fontSize: "clamp(28px, 4.2vw, 56px)" }}
              >
                {p2Words.map((word, i) => (
                  <ScrollWord
                    key={i}
                    word={word}
                    progress={scrollYProgress}
                    idx={i}
                    total={p2Words.length}
                    fromProgress={0.30}
                    toProgress={0.56}
                  />
                ))}
              </p>
            </motion.div>
          )}

          {phase === 3 && (
            <motion.div
              key="p3"
              className="absolute inset-0 flex items-center justify-center px-8 lg:px-[180px]"
              style={{ paddingTop: "68px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={phaseFade}
            >
              <p
                className="font-sans font-medium tracking-[-2px] leading-[0.95] max-w-[860px] w-full"
                style={{ fontSize: "clamp(28px, 4.2vw, 56px)" }}
              >
                {p3Words.map((word, i) => (
                  <ScrollWord
                    key={i}
                    word={word}
                    progress={scrollYProgress}
                    idx={i}
                    total={p3Words.length}
                    fromProgress={0.60}
                    toProgress={0.85}
                  />
                ))}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Section 2: The Craft ──────────────────────────────────────────────────────
const principles = [
  { n: "01", text: "The illusion is clarity" },
  { n: "02", text: "Constraints are the trick" },
  { n: "03", text: "Everyone sees the result. Few understand why it works." },
];

function CraftSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionReveal>
      <div ref={ref} className="w-full flex flex-col lg:flex-row min-h-screen">

        {/* Left: label + quote + body */}
        <div className="flex flex-col justify-center gap-6 px-8 lg:pl-[180px] lg:pr-16 py-24 lg:py-0 lg:w-[58%]">
          <span className="font-mono text-[16px] tracking-[-0.48px] text-[#565656]">
            The Craft
          </span>
          <h3
            className="font-sans font-medium tracking-[-2.5px] leading-[0.9] text-[#2E2E2E]"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          >
            <RevealLine inView={inView} delay={0.1}>Design is just</RevealLine>
            <RevealLine inView={inView} delay={0.2}>magic with a name.</RevealLine>
          </h3>
          <p className="font-sans text-[16px] text-[#565656] tracking-[-0.32px] leading-[1.55] max-w-[380px]">
            Same root. Understanding what others don&apos;t. Making the complex
            feel inevitable. Changing what people believe is possible.
          </p>
        </div>

        {/* Right: numbered principles */}
        <div className="flex flex-col justify-end lg:w-[42%] border-t border-black/[0.08] lg:border-t-0 lg:border-l lg:border-black/[0.08] px-8 lg:px-12 pb-12 lg:pb-20 pt-10 lg:pt-0">
          {principles.map((item, i) => (
            <div
              key={item.n}
              className="flex items-start gap-5 py-6 border-t border-black/[0.07]"
            >
              <span className="font-mono text-[12px] text-[#B0B0B0] tracking-[-0.48px] mt-[3px] shrink-0">
                {item.n}
              </span>
              <p className="font-sans font-medium text-[17px] text-[#2E2E2E] tracking-[-0.5px] leading-[1.3]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </SectionReveal>
  );
}

// ── Section 3: Philosophy ─────────────────────────────────────────────────────
function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionReveal dark className="text-center px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col items-center">
        <span className="font-mono text-[16px] tracking-[-0.48px] text-[#565656]">
          The Philosophy
        </span>
        <h2
          className="font-sans font-medium tracking-[-3.2px] leading-[0.9] mt-6 max-w-[820px]"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          <RevealLine inView={inView} delay={0.1} className="text-[#EFEFEF]">The best magic is invisible.</RevealLine>
          <RevealLine inView={inView} delay={0.2} className="text-[#FF3377]">So is the best design.</RevealLine>
        </h2>
        <p className="font-sans text-[18px] text-[#D1D1D1] tracking-[-0.36px] leading-[1.5] max-w-[520px] mt-8">
          The real work is never the thing people see. It&apos;s the invisible
          layer, every decision, every constraint, every late revision that made
          the result feel effortless.
        </p>
      </div>
    </SectionReveal>
  );
}

// ── Section 4: How I Work ─────────────────────────────────────────────────────
const methods = [
  {
    n: "01",
    title: "Bring clarity",
    body: "I make the undefined definable. Turning ambiguity into direction teams can actually act on.",
  },
  {
    n: "02",
    title: "Challenge assumptions",
    body: "I question the obvious so teams don't build confidently in the wrong direction.",
  },
  {
    n: "03",
    title: "Shape & test",
    body: "Ideas become tangible fast. I work alongside teams to prototype and validate, not just advise.",
  },
  {
    n: "04",
    title: "Stay close",
    body: "I'm focused on outcomes, not outputs. Close enough to course-correct before it's costly.",
  },
];

function MethodSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionReveal className="px-8 lg:px-[180px] py-32">
      <div ref={ref} className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[16px] tracking-[-0.48px] text-[#565656]">
              How I Work
            </span>
            <h2
              className="font-sans font-medium tracking-[-3.2px] leading-[0.95] text-[#2E2E2E] mt-4"
              style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
            >
              <RevealLine inView={inView} delay={0.1}>I don&apos;t operate as an</RevealLine>
              <RevealLine inView={inView} delay={0.2}>external observer.</RevealLine>
            </h2>
          </div>
          <p className="font-sans text-[16px] text-[#565656] tracking-[-0.32px] leading-[1.4] lg:max-w-[300px]">
            Think of it as a bridge between vision and execution, where ideas
            don&apos;t just stay ideas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {methods.map((m) => (
            <div key={m.n} className="bg-white border border-black/[0.07] rounded-2xl p-8 flex flex-col gap-4">
              <span className="font-mono text-[13px] tracking-[-0.39px] text-[#B0B0B0]">
                {m.n}
              </span>
              <h3 className="font-sans font-medium text-[22px] tracking-[-1.1px] leading-[1.1] text-[#2E2E2E]">
                {m.title}
              </h3>
              <p className="font-sans text-[16px] text-[#565656] tracking-[-0.32px] leading-[1.4]">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

// ── Section 5: Closing ────────────────────────────────────────────────────────
function ClosingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionReveal dark className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col gap-8 max-w-[700px] w-full">
        <span className="font-mono text-[16px] tracking-[-0.48px] text-[#565656]">
          Let&apos;s Talk
        </span>
        <h2
          className="font-sans font-medium tracking-[-3.2px] leading-[0.95] text-[#EFEFEF]"
          style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}
        >
          <RevealLine inView={inView} delay={0.1}>If you&apos;re navigating uncertainty,</RevealLine>
          <RevealLine inView={inView} delay={0.2}>I&apos;m always open to a conversation.</RevealLine>
        </h2>
        <p className="font-sans text-[18px] text-[#D1D1D1] tracking-[-0.36px] leading-[1.5] max-w-[520px]">
          Whether you&apos;re building something new, trying to align business
          and product decisions, or just unsure of the next step, let&apos;s
          talk.
        </p>
        <motion.a
          href="/#contact"
          className="inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium text-[15px] text-white tracking-[-0.45px] w-fit transition-opacity hover:opacity-80"
          style={{ background: "#111", padding: "12px 20px" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.25, ease }}
        >
          Start a conversation
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 13L13 3M13 3H6M13 3v7" />
          </svg>
        </motion.a>
      </div>
    </SectionReveal>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="relative">
      <Nav />
      <HeroSection />
      <CraftSection />
      <PhilosophySection />
      <MethodSection />
      <ClosingSection />
      <Footer />
    </main>
  );
}
