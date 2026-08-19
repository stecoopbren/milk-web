"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import type { MotionValue } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

// Each word sweeps from dim to full color across a 6-item window.
// Images count as one index slot so the sweep paces through them naturally.
const TOTAL_ITEMS = 13; // 1 word + 1 img + 5 words + 1 br + 4 words + 1 img + 1 word

function HWord({
  word,
  index,
  progress,
  trailingSpace,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  trailingSpace: boolean;
}) {
  const start = index / TOTAL_ITEMS;
  const end = Math.min((index + 6) / TOTAL_ITEMS, 1);
  const color = useTransform(progress, [start, end], ["#C8C8C8", "#2E2E2E"]);
  return (
    <>
      <motion.span suppressHydrationWarning style={{ color, display: "inline" }}>{word}</motion.span>
      {trailingSpace && " "}
    </>
  );
}

function TiltImage({ src, objectPosition }: { src: string; objectPosition?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = 320;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / radius));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / radius));
      rotateY.set(dx * 8);
      rotateX.set(-dy * 8);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rotateX, rotateY]);

  return (
    <span
      ref={ref}
      style={{ display: "inline-block", perspective: "500px", verticalAlign: "middle", marginInline: "0.25em" }}
    >
      <motion.img
        src={src}
        alt=""
        style={{
          display: "inline-block",
          height: "1em",
          width: "calc(2.5em - 20px)",
          borderRadius: 24,
          objectFit: "cover",
          objectPosition: objectPosition ?? "center",
          verticalAlign: "middle",
          rotateX: springX,
          rotateY: springY,
        }}
      />
    </span>
  );
}

// Segment layout (all indices relative to TOTAL_ITEMS = 13):
// 0:"Building"
// 1:[image1]
// 2:"is"  3:"the"  4:"easy"  5:"part"  6:"now."
// [br]
// 7:"Knowing"  8:"what"  9:"to"  10:"build"
// 11:[image2]
// 12:"isn't."

export default function PositioningSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Offset progress so the first ~4 words are already highlighted on arrival
  const progress = useTransform(scrollYProgress, [0, 1], [0.25, 1.25]);


  return (
    <section
      ref={ref}
      id="about-us"
      className="snap-section relative"
      data-free-scroll="true"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col px-8 lg:px-[180px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-6 mx-auto">
<p className="text-serif-eyebrow text-[#0C0C12] text-center max-w-xl">
              In an age where AI gives everyone the same head start, design is your new edge.
            </p>

            <div className="text-section-heading text-center w-fit">
              <span className="block">
                <HWord word="Building"     index={0}  progress={progress} trailingSpace={false} />
                {" "}
                <TiltImage src="/FullSizeRender_VSCO.JPG" objectPosition="center 60%" />
                {/* index 1 = image1 slot */}
                <HWord word="is"           index={2}  progress={progress} trailingSpace />
                <HWord word="the"          index={3}  progress={progress} trailingSpace />
                <HWord word="easy"         index={4}  progress={progress} trailingSpace />
                <HWord word="part"         index={5}  progress={progress} trailingSpace />
                <HWord word="now."         index={6}  progress={progress} trailingSpace={false} />
                <br />
                <HWord word="Knowing"      index={7}  progress={progress} trailingSpace />
                <HWord word="what"         index={8}  progress={progress} trailingSpace />
                <HWord word="to"           index={9}  progress={progress} trailingSpace />
                <HWord word="build"        index={10} progress={progress} trailingSpace={false} />
                {" "}
                <TiltImage src="/B37FFF98-05DF-4025-BDF8-7415F841280C.JPG" />
                {/* index 11 = image2 slot */}
                <HWord word="isn&apos;t."  index={12} progress={progress} trailingSpace={false} />
              </span>
            </div>

            <a
              href="https://medium.com/@stevencooper_75268/why-design-matters-05df943703eb?sharedUserId=stevencooper_75268"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0C0C12] rounded-full px-6 py-2.5 font-sans text-[14px] font-medium text-white inline-flex items-center gap-2 hover:bg-[#2E2E2E] transition-colors tracking-[-0.28px]"
            >
              Why Design Matters?
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 13L13 3M13 3H6M13 3v7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
