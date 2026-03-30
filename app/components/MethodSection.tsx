"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RevealLine } from "./animations";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

// Images from Figma (valid for 7 days)
const imgEllipse3 = "https://www.figma.com/api/mcp/asset/6d63e650-af82-44e4-ba01-35949df721d1";
const imgEllipse4 = "https://www.figma.com/api/mcp/asset/9f2a7418-bc6d-45e5-a294-81c7f00b42c9";
const imgPlane  = "https://www.figma.com/api/mcp/asset/b074becf-5706-4a57-a50d-b2e985cbf85f"; // LEARN
const imgCow    = "https://www.figma.com/api/mcp/asset/ca0d2c98-62bf-4d47-b347-e642a38f754b"; // DEFINE
const imgMilk   = "https://www.figma.com/api/mcp/asset/8a29b0e7-d2c9-4ea3-96cb-36f1c06634de"; // EXPERIMENT

const steps = [
  {
    id: 0,
    label: "LEARN",
    step: "STEP 1 / LEARN",
    title: "Understand reality before trying to change it.",
    body: "Explore the problem by identifying assumptions, gathering user insights, and analyzing behaviors to inform decisions.",
    ellipse: imgEllipse3,
    img: imgPlane,
    imgStyle: { width: "105px", height: "100px", top: "29px", left: "21.94px", rotate: "0deg" },
  },
  {
    id: 1,
    label: "DEFINE",
    step: "STEP 2 / DEFINE",
    title: "Bring clarity to what matters the most.",
    body: "Transform learning into clear direction by defining the core problem, uncovering key opportunities, and aligning teams on what must change and why.",
    ellipse: imgEllipse4,
    img: imgCow,
    imgStyle: { width: "118.808px", height: "100px", top: "19.2px", left: "19.68px", rotate: "1.13deg" },
  },
  {
    id: 2,
    label: "EXPERIMENT",
    step: "STEP 3 / EXPERIMENT",
    title: "Turn direction into evidence, turn ideas into results.",
    body: "Turn ideas into action. We test assumptions with prototypes and real user feedback to learn fast and decide whether to iterate, or just pivot.",
    ellipse: imgEllipse4,
    img: imgMilk,
    imgStyle: { width: "79.727px", height: "100px", top: "17.86px", left: "30.17px", rotate: "22.67deg" },
  },
];

function MethodCard({ step }: { step: typeof steps[0] }) {
  return (
    <div className="glass-border-animated rounded-2xl flex flex-col gap-6 items-center p-12 w-[338px] shrink-0">
      {/* Circular image: ellipse blob + product image overlaid via CSS grid */}
      <div className="relative size-[154px] shrink-0">
        {/* Ellipse blob background — extends beyond the 154px box */}
        <div className="absolute inset-[-18.83%_-25.97%_-33.12%_-25.97%]">
          <img src={step.ellipse} alt="" className="block w-full h-full" />
        </div>
        {/* Product image overlaid */}
        <img
          src={step.img}
          alt={step.label}
          className="absolute object-contain"
          style={{
            width: step.imgStyle.width,
            height: step.imgStyle.height,
            top: step.imgStyle.top,
            left: step.imgStyle.left,
            transform: `rotate(${step.imgStyle.rotate})`,
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-4 w-full items-center text-center">
        <div className="flex flex-col gap-2 items-start w-full">
          <p className="font-mono text-[#2F2F2F] text-[16px] tracking-[-0.48px] leading-6">
            {step.step}
          </p>
          <h3 className="font-sans font-medium text-[#2F2F2F] text-[20px] tracking-[-1px] leading-none text-left">
            {step.title}
          </h3>
        </div>
        <p className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] w-full text-left">
          {step.body}
        </p>
      </div>
    </div>
  );
}

export default function MethodSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  return (
    <SectionReveal id="method" className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col items-center gap-11 w-full py-24">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <RevealLine
            className="font-mono text-[#565656] text-[16px] lg:text-[20px] tracking-[-0.48px] lg:tracking-[-0.6px] leading-6"
            delay={0.1}
            inView={inView}
          >
            INNOVATION WORKS IN LOOPS
          </RevealLine>
          <h2
            className="font-sans font-medium text-[#2F2F2F] tracking-[-1.92px] leading-none"
            style={{ fontSize: "clamp(24px, 3vw, 32px)" }}
          >
            <RevealLine delay={0.25} inView={inView}>
              Here&apos;s our Method
            </RevealLine>
          </h2>
        </div>

        {/* Mobile: tab chips + single card */}
        <div className="lg:hidden w-full flex flex-col items-center gap-6">
          {/* Chips */}
          <motion.div
            className="glass-border-animated rounded-3xl p-2 w-full max-w-[326px]"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
          >
            <div className="flex">
              {steps.map((s) => (
                <button
                  key={s.id}
                  onClick={() => go(s.id)}
                  className={`flex-1 py-3 px-2 rounded-2xl text-[14px] font-sans transition-all duration-200 ${
                    active === s.id
                      ? "glass-border-animated font-bold text-[#2F2F2F] underline"
                      : "text-[#565656] font-normal"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Card */}
          <div className="relative w-full max-w-[326px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease }}
              >
                <MethodCard step={steps[active]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* State + arrows */}
          <div className="flex items-center justify-between w-full max-w-[326px]">
            <p className="font-mono text-[#2F2F2F] text-[16px] tracking-[-0.48px] leading-6">
              0{active + 1}/0{steps.length}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => go(Math.max(0, active - 1))}
                disabled={active === 0}
                className="glass-border-animated rounded-2xl p-2 disabled:opacity-30 transition-opacity"
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => go(Math.min(steps.length - 1, active + 1))}
                disabled={active === steps.length - 1}
                className="glass-border-animated rounded-2xl p-2 disabled:opacity-30 transition-opacity"
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: 3 cards side by side */}
        <div className="hidden lg:flex gap-8 items-stretch justify-center w-full">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.12 }}
            >
              <MethodCard step={s} />
            </motion.div>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
