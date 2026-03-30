"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { RevealLine, BlurReveal } from "./animations";
import SectionReveal from "./SectionReveal";

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <SectionReveal id="about-us" className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col gap-6 max-w-[610px] w-full">

        <RevealLine
          className="font-mono text-[16px] lg:text-[20px] text-[#2F2F2F] tracking-[-0.48px] lg:tracking-[-0.6px] leading-6"
          delay={0.1}
          inView={inView}
        >
          While you hesitate, others ship
        </RevealLine>

        <h2
          className="font-sans font-medium text-[#0C0C12] tracking-[-3.2px] leading-[0.9]"
          style={{ fontSize: "clamp(36px, 5.5vw, 56px)" }}
        >
          <RevealLine delay={0.2} inView={inView}>If you want real results,</RevealLine>
          <RevealLine delay={0.3} inView={inView}>you have to dare to do</RevealLine>
          <RevealLine delay={0.4} inView={inView}>things differently.</RevealLine>
        </h2>

        <BlurReveal
          text="In today's AI-driven world, adapting is key. We use design to solve real business challenges and create lasting impact, helping partners reveal their unique essence with memorable solutions."
          className="font-sans font-normal text-[#282828] text-[16px] tracking-[-0.32px] leading-[1.2]"
          delay={0.55}
        />
      </div>
    </SectionReveal>
  );
}
