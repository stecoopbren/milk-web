"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { RevealLine } from "./animations";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

function useCountUp(end: number, decimals: number, duration: number, inView: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parseFloat((eased * end).toFixed(decimals));
      setValue(current);
      if (progress < 1) requestAnimationFrame(update);
      else setValue(end);
    };

    requestAnimationFrame(update);
  }, [inView, end, decimals, duration]);

  return value;
}

interface StatProps {
  prefix?: string;
  suffix?: string;
  end: number;
  decimals: number;
  unit?: string;
  label: string;
  sublabel: string;
  inView: boolean;
  delay: number;
}

function Stat({ prefix = "", suffix = "", end, decimals, unit = "", label, sublabel, inView, delay }: StatProps) {
  const count = useCountUp(end, decimals, 2, inView);
  const display = `${prefix}${decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}${unit}${suffix}`;

  return (
    <div className="relative flex-1 flex flex-col justify-end gap-5 px-0 py-10 lg:py-16 overflow-hidden min-h-[220px] lg:min-h-[280px]">

      {/* Ghost watermark number */}
      <motion.span
        className="absolute top-0 left-0 font-sans font-medium leading-[0.85] select-none pointer-events-none text-[#0C0C12] whitespace-nowrap"
        style={{ fontSize: "clamp(80px, 11vw, 148px)", opacity: 0 }}
        animate={inView ? { opacity: 0.055 } : {}}
        transition={{ duration: 1.4, ease, delay: delay + 0.1 }}
      >
        {display}
      </motion.span>

      {/* Actual number */}
      <motion.p
        className="relative font-sans font-medium text-[#0C0C12] leading-none"
        style={{ fontSize: "clamp(44px, 5.5vw, 72px)", letterSpacing: "-3px" }}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease, delay }}
      >
        {display}
      </motion.p>

      {/* Labels */}
      <motion.div
        className="relative flex flex-col gap-1"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease, delay: delay + 0.35 }}
      >
        <p className="font-sans text-[#0C0C12] text-[15px] tracking-[-0.3px] leading-snug">
          {label}
        </p>
        <p className="text-micro font-sans text-[#B0B0B0] leading-snug">
          {sublabel}
        </p>
      </motion.div>

    </div>
  );
}

function Divider({ inView, delay }: { inView: boolean; delay: number }) {
  return (
    <motion.div
      className="hidden lg:block w-px bg-[#E4E4E4] self-stretch origin-top"
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 0.9, ease, delay }}
    />
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionReveal id="results" className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col gap-10 w-full max-w-[1062px] mx-auto">

        <RevealLine
          className="text-ui text-[#565656]"
          delay={0.1}
          inView={inView}
        >
          By the numbers
        </RevealLine>

        {/* Stats row */}
        <div className="flex flex-col lg:flex-row gap-0">
          <Stat
            prefix="$"
            suffix="+"
            end={3.6}
            decimals={1}
            unit="M"
            label="Raised by our clients"
            sublabel="ACROSS FUNDING ROUNDS"
            inView={inView}
            delay={0.2}
          />
          <Divider inView={inView} delay={0.3} />
          <div className="lg:pl-12 xl:pl-16 flex-1">
            <Stat
              suffix="+"
              end={40}
              decimals={0}
              label="Projects shipped"
              sublabel="ACROSS 3 CONTINENTS"
              inView={inView}
              delay={0.36}
            />
          </div>
          <Divider inView={inView} delay={0.44} />
          <div className="lg:pl-12 xl:pl-16 flex-1">
            <Stat
              end={12}
              decimals={0}
              unit=" wks"
              label="Average from kickoff to launch"
              sublabel="ONE METHOD, EVERY TIME"
              inView={inView}
              delay={0.52}
            />
          </div>
        </div>

      </div>
    </SectionReveal>
  );
}
