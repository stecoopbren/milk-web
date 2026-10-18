"use client";

import { useRef } from "react";
import Lottie from "lottie-react";
import { ScrollColorText } from "./animations";
import SectionReveal from "./SectionReveal";
import guideAnimation from "../../public/Formula/Guide.json";

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <SectionReveal id="about-us" className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex w-full max-w-[610px] flex-col items-center gap-6 text-center">
        <Lottie animationData={guideAnimation} loop className="h-48 w-48" />

        <h3 className="font-sans text-[18px] font-normal tracking-[-0.5px] text-[#888888]">
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
