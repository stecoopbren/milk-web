"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { MotionValue } from "framer-motion";
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
  const end = Math.min((index + 4) / total, 1);
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
  const inView = useInView(outerRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], [0.1, 1.2]);

  useEffect(() => {
    fetch("/Formula/12.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAnimData(d))
      .catch(() => {});
  }, []);

  const line2 = ["FIND", "MARKET", "FIT"];
  const line3 = ["to", "build", "THE", "RIGHT", "THING"];
  const total = line2.length + line3.length;

  return (
    <div
      id="bio"
      ref={outerRef}
      className="snap-section relative"
      data-free-scroll="true"
      style={{ height: "250vh", scrollSnapAlign: "none" }}
    >
      <div className="sticky top-0 flex items-start justify-center px-8 lg:px-[180px]" style={{ height: "100svh", paddingTop: 148 }}>
        <div className="relative w-full flex flex-col items-center gap-4">
          <p className="text-serif-eyebrow text-[#0C0C12]">
            Long story short
          </p>
          <div className="text-case-title text-center w-full">
            <div style={{ color: "#0C0C12" }}>
              I help teams of all sizes
            </div>
            <div>
              {line2.map((word, i) => (
                <Word key={i} word={word} index={i} total={total} progress={progress} trailingSpace={i < line2.length - 1} defaultHighlighted={false} />
              ))}
            </div>
            <div>
              {line3.map((word, i) => (
                <Word key={i + line2.length} word={word} index={i + line2.length} total={total} progress={progress} trailingSpace={i < line3.length - 1} defaultHighlighted={[0, 1].includes(i)} />
              ))}
            </div>
          </div>
          {animData && (
            <>
              <motion.div
                className="absolute top-full lg:hidden"
                style={{ marginTop: -80, width: "min(95vw, 560px)", left: "50%" }}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={{
                  hidden: { y: 320, x: "-50%", opacity: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                  visible: { y: 0, x: "-50%", opacity: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 } },
                }}
              >
                <Lottie animationData={animData} loop />
              </motion.div>
              <motion.div
                className="absolute top-full hidden lg:block"
                style={{ marginTop: -160, width: "clamp(480px, 65vw, 900px)" }}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={{
                  hidden: { y: 480, opacity: 0, transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] } },
                  visible: { y: 0, opacity: 1, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 } },
                }}
              >
                <Lottie animationData={animData} loop />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
