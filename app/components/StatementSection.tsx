"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Lottie from "lottie-react";
import { ScrollColorText } from "./animations";
import SectionReveal from "./SectionReveal";
import guideAnimation from "../../public/Formula/Guide.json";

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <SectionReveal id="about-us" className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col gap-6 max-w-[610px] w-full items-center text-center">

        <Lottie animationData={guideAnimation} loop className="w-48 h-48" />

        <h3 className="font-sans font-normal text-[#888888] text-[18px] tracking-[-0.5px]">
          <ScrollColorText text="Always chart before you sail." />
        </h3>

        <h2 className="text-heading w-full">
          <ScrollColorText text="Assumptions blind." />
          <ScrollColorText text="Hypotheses guide." />
        </h2>

        <ScrollColorText
          text="Leading great teams taught me that guessing is expensive. I bring proven methods that reduce uncertainty and make subjective decisions objective."
          className="text-body"
        />

      </div>
    </SectionReveal>
  );
}
