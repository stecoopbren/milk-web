"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, animate, useTransform, type MotionValue } from "framer-motion";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

const testimonials = [
  {
    quote:
      "Steven has this rare talent for building the big picture while keeping a sharp eye on details. He looked at every problem holistically and designed the strategy, not just the UX flows. Anyone looking for real clarity and impact in their product work will find exactly that in Steven.",
    name: "Rakesh Sharma",
    title: "Sr. Manager of Product Design at Cisco",
    avatar: "/headshots/rakesh-sharma.webp",
  },
  {
    quote:
      "Working with Steven changed how our entire team thinks about product decisions. His playbook sounds simple, but what it does to your team's alignment is remarkable. We stopped debating opinions and started testing hypotheses. The product we shipped was better, and we got there faster than we ever expected.",
    name: "Ilya Shchyryi",
    title: "Lead Product Designer at Meta",
    avatar: "/headshots/ilya-shchyryi.webp",
  },
];

function Word({
  word,
  progress,
  index,
  total,
  trailingSpace,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
  trailingSpace: boolean;
}) {
  // Each word lights up across a window of 8 words' worth of scroll progress
  const start = index / total;
  const end = Math.min((index + 8) / total, 1);
  const color = useTransform(progress, [start, end], ["#C0C0C0", "#0C0C12"]);

  return (
    <>
      <motion.span style={{ color, display: "inline" }}>{word}</motion.span>
      {trailingSpace && " "}
    </>
  );
}

function ScrollHighlightQuote({
  text,
  progress,
}: {
  text: string;
  progress: MotionValue<number>;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Word
          key={i}
          word={word}
          progress={progress}
          index={i}
          total={words.length}
          trailingSpace={i < words.length - 1}
        />
      ))}
    </>
  );
}

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);

  const progress = useMotionValue(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(contentRef, { once: true, margin: "-80px" });

  // Animate words in over 2.5s when section enters view, then auto-advance
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const controls = animate(progress, 1, { duration: 2.5, ease: "linear" });
    controls.then(() => {
      if (cancelled) return;
      setTimeout(() => {
        setIndex(i => (i + 1) % testimonials.length);
        // keep progress at 1 so next testimonial appears fully lit
      }, 500);
    });
    return () => { cancelled = true; controls.stop(); };
  }, [inView]);

  const go = (dir: 1 | -1) => {
    progress.set(1);
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  };

  const goTo = (i: number) => {
    progress.set(1);
    setIndex(i);
  };

  return (
    <SectionReveal id="testimonial" className="px-8 lg:px-[180px]">
      <div ref={contentRef} className="w-full pt-16 lg:pt-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

          {/* Label */}
          <motion.div
            className="shrink-0 lg:w-[160px]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <p className="text-serif-eyebrow text-[#0C0C12]">
              What people say
            </p>
          </motion.div>

          {/* Quote block */}
          <div className="flex flex-col gap-8 flex-1 min-w-0">
            {/* Carousel rail — overflow hidden clips off-screen slides, height stays fixed */}
            <div className="overflow-hidden">
              <motion.div
                className="flex items-start"
                animate={{ x: `${-index * 100}%` }}
                transition={{ duration: 0.55, ease }}
              >
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="w-full flex-shrink-0 flex flex-col gap-10"
                    aria-hidden={i !== index}
                  >
                    <blockquote
                      className="leading-[1.15]"
                      style={{ fontFamily: "Ambit", fontWeight: 400, fontSize: "clamp(20px, 2.5vw, 32px)", letterSpacing: "-0.4px", lineHeight: 1.25 }}
                    >
                      <ScrollHighlightQuote
                        text={`\u201C${t.quote}\u201D`}
                        progress={progress}
                      />
                    </blockquote>

                    <div className="flex items-center gap-4">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-ui text-[#0C0C12]">
                          {t.name}
                        </p>
                        <p className="text-ui text-[#B0B0B0]">
                          {t.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Controller — arrows left + dots right on mobile; both right-aligned on desktop */}
            <div className="flex items-center justify-between lg:justify-end lg:gap-4 mt-2">
              {/* Arrows — left on mobile, rightmost on desktop */}
              <div className="flex items-center gap-2 order-1 lg:order-2">
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Dots — right on mobile, left of arrows on desktop */}
              <div className="flex items-center gap-2 order-2 lg:order-1">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`rounded-full transition-all duration-300 ${
                      i === index ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </SectionReveal>
  );
}
