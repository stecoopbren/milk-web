"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Lottie from "lottie-react";

function Word({
  word,
  index,
  total,
  progress,
  trailingSpace,
  defaultHighlighted,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  trailingSpace?: boolean;
  defaultHighlighted?: boolean;
}) {
  const start = index / total;
  const end = Math.min((index + 5) / total, 1);
  const color = useTransform(progress, [start, end], [defaultHighlighted ? "#0C0C12" : "#C0C0C0", "#0C0C12"]);
  return (
    <>
      <motion.span style={{ color, display: "inline" }}>{word}</motion.span>
      {trailingSpace && " "}
    </>
  );
}


export default function BioSection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animData, setAnimData] = useState<any>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    fetch("/Formula/12.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAnimData(d))
      .catch(() => {});
  }, []);

  const line2 = ["the", "RIGHT", "PROBLEM", "before", "you", "build", "the", "WRONG", "THING."];
  const total = line2.length;

  return (
    <div
      id="bio"
      ref={outerRef}
      className="snap-section relative"
      data-free-scroll="true"
      style={{ height: "250vh", scrollSnapAlign: "none" }}
    >
      <div className="sticky top-0 h-screen flex items-start justify-center px-8 lg:px-[180px]" style={{ paddingTop: 148 }}>
        <div className="relative w-full flex flex-col items-center gap-4">
          <p className="text-serif-eyebrow text-[#0C0C12]">
            Long story short
          </p>
          <div className="text-case-title text-center w-full">
            <div style={{ color: "#0C0C12" }}>
              I help you find
            </div>
            <div>
              {line2.map((word, i) => (
                <Word key={i} word={word} index={i} total={total} progress={scrollYProgress} trailingSpace={i < line2.length - 1} defaultHighlighted={![1, 2, 7, 8].includes(i)} />
              ))}
            </div>
          </div>
          {animData && (
            <>
              {/* Mobile: sits below the text, no overlap */}
              <div className="block lg:hidden" style={{ marginTop: -40, width: "clamp(560px, 95vw, 800px)" }}>
                <Lottie animationData={animData} loop />
              </div>
              {/* Desktop: overlaps down into next section */}
              <div className="absolute top-full hidden lg:block" style={{ marginTop: -160, width: "clamp(480px, 65vw, 900px)" }}>
                <Lottie animationData={animData} loop />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
