"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export default function ScribbleSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formulaData, setFormulaData] = useState<any>(null);
  useEffect(() => {
    fetch("/Formula/19%202.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setFormulaData(d))
      .catch(() => {});
  }, []);

  return (
    <div
      className="snap-section relative flex h-screen flex-col items-center justify-center overflow-hidden"
      style={{ background: "#FFFFFF" }}
    >
      {/* Text */}
      <div
        className="relative flex flex-col items-center px-8 text-center lg:px-[180px]"
        style={{ zIndex: 1 }}
      >
        <p className="text-serif-eyebrow mb-2 text-black" style={{ fontFamily: "Ambit" }}>
          Great idea but no clue
        </p>
        {/* Mobile: each phrase on its own line so nothing overflows at 64px */}
        <h2 className="text-display text-[56px] leading-[0.9] text-black lg:hidden">
          Where to start
          <br />
          while
          <br />
          EXPECTATIONS
          <br />
          GROW.
        </h2>
        {/* Desktop: artistic layout with intentional spacing */}
        <h2 className="text-display hidden leading-[0.9] text-black lg:block">
          Where to start
          <br />
          while&nbsp;&nbsp;EXPECTATIONS
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GROW.
        </h2>
        {/* Formula — desktop only, absolute relative to text div */}
        {formulaData && (
          <div
            className="pointer-events-none absolute hidden md:block"
            style={{ width: "clamp(200px, 20vw, 320px)", top: "calc(100% - 296px)", left: 494 }}
          >
            <Lottie animationData={formulaData} loop />
          </div>
        )}
      </div>

      {/* Formula — mobile only, in flow below text */}
    </div>
  );
}
