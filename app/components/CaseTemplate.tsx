"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { RevealLine, BlurReveal } from "./animations";
import Link from "next/link";
import { CaseData, CaseSection } from "@/app/lib/cases";
import { ProjectCard, projects } from "./ProjectsSection";
import MilkBackground from "./MilkBackground";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Full-screen image section (90vh, CSS parallax) ───────────────────────────

function LoopingVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

// ─── Cycling hero slideshow ───────────────────────────────────────────────────

function HeroSlideshow({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    images.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % images.length), 200);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="snap-section scroll-mt-[80px] h-[calc(56.25vw+40px)] lg:h-screen lg:aspect-auto relative overflow-hidden bg-[#0C0C12]" data-dark="true">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: i === active ? 1 : 0,
            transition: "none",
          }}
        />
      ))}
    </div>
  );
}

function FullScreenImage({ src, alt, video, mobileNaturalAspect, image2 }: { src: string; alt: string; video?: string; mobileNaturalAspect?: boolean; image2?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [hPad, setHPad] = useState(180);
  const [showSecond, setShowSecond] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  useEffect(() => {
    const update = () => setHPad(window.innerWidth < 1024 ? 32 : 180);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!image2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setShowSecond(true);
      intervalId = setInterval(() => setShowSecond(s => !s), 4000);
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [image2]);

  return (
    <div ref={ref} className={`snap-section scroll-mt-[80px] bg-[#0C0C12] ${mobileNaturalAspect ? "aspect-video lg:h-screen lg:aspect-auto" : "h-screen"}`} data-dark="true">
      <motion.div
        className="h-full w-full overflow-hidden relative"
        initial={{ paddingLeft: hPad, paddingRight: hPad, borderRadius: 16 }}
        animate={inView ? { paddingLeft: 0, paddingRight: 0, borderRadius: 0 } : {}}
        transition={{ type: "spring", stiffness: 55, damping: 22 }}
      >
        {video ? (
          <motion.div
            style={{ width: "100%", height: "100%" }}
            initial={{ scale: 1.0 }}
            animate={inView ? { scale: 1.06 } : {}}
            transition={{ scale: { duration: 9, ease: "linear" } }}
          >
            <LoopingVideo src={video} />
          </motion.div>
        ) : (
          <>
            <motion.img
              src={src}
              alt={alt}
              style={{ width: "100%", height: "130%", objectFit: "cover", display: "block", y: imageY }}
              initial={{ scale: 1.0 }}
              animate={inView ? { scale: 1.06 } : {}}
              transition={{ scale: { duration: 9, ease: "linear" } }}
            />
            {image2 && (
              <motion.img
                src={image2}
                alt={alt}
                style={{ position: "absolute", inset: 0, width: "100%", height: "130%", objectFit: "cover", display: "block", y: imageY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showSecond ? 1 : 0 }}
                transition={{ duration: 1.5, ease }}
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowUpRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 8H3M3 8l5-5M3 8l5 5" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

// ─── A. CaseHero ──────────────────────────────────────────────────────────────

function CaseHero({ caseData }: { caseData: CaseData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const router = useRouter();

  return (
    <div
      ref={ref}
      className="relative snap-section overflow-hidden flex flex-col items-center justify-center px-8 lg:px-[180px]"
      style={{ minHeight: "80vh" }}
    >
      <MilkBackground contained />

      {/* Back button — absolute on desktop, flows at top on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="lg:absolute lg:top-[132px] lg:left-[180px] w-full lg:w-auto self-start lg:self-auto mb-6 lg:mb-0"
      >
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 font-sans text-[14px] font-medium text-[#565656] hover:text-[#0C0C12] tracking-[-0.28px] transition-colors"
        >
          <ArrowLeft />
          Back
        </button>
      </motion.div>

      {/* Text block — centered */}
      <div className="flex flex-col items-center text-center gap-6 w-full">
        <RevealLine
          className="text-serif-eyebrow text-[#0C0C12]"
          delay={0.1}
          inView={inView}
        >
          {caseData.heroLabel ?? `${caseData.client} | ${caseData.category}`}
        </RevealLine>

        <h1
          className="text-case-title text-[#2E2E2E] max-w-none w-full"
        >
          {caseData.title.split("\n").map((line, i) => (
            <RevealLine key={i} className="block" delay={0.25 + i * 0.12} inView={inView}>
              {line}
            </RevealLine>
          ))}
        </h1>

        <BlurReveal
          text={caseData.subtitle}
          className="text-body text-[#565656] max-w-[800px]"
          delay={0.45}
        />

        <motion.div
          className="flex flex-col items-center gap-3 w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.75 }}
        >
          {caseData.websiteUrl && (
            <a
              href={caseData.websiteUrl}
              className="border border-[#2E2E2E]/15 rounded-full px-6 py-2.5 font-sans text-[14px] font-medium text-[#2E2E2E] inline-flex items-center gap-2 hover:border-[#2E2E2E]/40 transition-colors tracking-[-0.28px]"
            >
              View Website
              <ArrowUpRight />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── B. SplitSection ─────────────────────────────────────────────────────────

function SplitSection({ section }: { section: Extract<CaseSection, { type: "split" }> }) {
  const paragraphs = section.body.split("\n\n");
  const isLong = paragraphs.length > 3;
  const phase1 = isLong ? paragraphs.slice(0, 2) : paragraphs;
  const phase2 = isLong ? paragraphs.slice(2) : [];

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const phase1Opacity = useTransform(scrollYProgress, [0.35, 0.55], [1, 0]);
  const phase2Opacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  const Bullets = section.bullets ? (
    <ul className="flex flex-col gap-1 mt-1">
      {section.bullets.map((b, i) => (
        <motion.li
          key={i}
          className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.07 }}
        >
          <span className="shrink-0">·</span>
          <span>{b}</span>
        </motion.li>
      ))}
    </ul>
  ) : null;

  const innerContent = (
    <div className="flex flex-col w-full gap-8 lg:gap-10">
      <motion.p
        className="text-serif-eyebrow text-[#0C0C12]"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        {section.label}
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32 lg:items-start">
        <h2 className="text-section-heading text-[#2E2E2E]">
          {section.heading.split("\n").map((line, i) => (
            <RevealLine key={i} className="block" delay={0.15 + i * 0.1} inView={inView}>
              {line}
            </RevealLine>
          ))}
        </h2>

        <div className="mt-8 lg:mt-0 flex flex-col justify-start gap-4 lg:max-w-[520px]">
          {isLong ? (
            <>
              {/* Mobile: show first two paragraphs */}
              <div className="lg:hidden flex flex-col gap-4">
                {phase1.map((para, i) => (
                  <p key={i} className="text-body text-[#565656]">{para}</p>
                ))}
              </div>

              {/* Desktop: crossfade between two phases */}
              <div
                className="hidden lg:grid"
                style={{ gridTemplateAreas: '"stack"' }}
              >
                <motion.div
                  style={{ gridArea: "stack", opacity: phase1Opacity }}
                  className="flex flex-col gap-4"
                >
                  {phase1.map((para, i) => (
                    <motion.p
                      key={i}
                      className="text-body text-[#565656]"
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
                    >
                      {para}
                    </motion.p>
                  ))}
                </motion.div>
                <motion.div
                  style={{ gridArea: "stack", opacity: phase2Opacity }}
                  className="flex flex-col gap-4"
                >
                  {phase2.map((para, i) => (
                    <p key={i} className="text-body text-[#565656]">{para}</p>
                  ))}
                  {Bullets}
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {paragraphs.map((para, i) => (
                <motion.p
                  key={i}
                  className={`text-body text-[#565656]${i > 0 ? " hidden lg:block" : ""}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
                >
                  {para}
                </motion.p>
              ))}
              {Bullets}
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isLong) {
    return (
      <div ref={ref} className="snap-section lg:min-h-[200vh] min-h-screen px-8 lg:px-[180px]" data-native-scroll="true">
        {/* Mobile: normal flow */}
        <div className="lg:hidden flex items-start pt-24 pb-12">
          {innerContent}
        </div>
        {/* Desktop: sticky so heading stays while right column fades */}
        <div className="hidden lg:flex sticky top-0 h-screen items-center py-16">
          {innerContent}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center px-8 lg:px-[180px] pt-24 pb-12 lg:py-16" data-native-scroll="true">
      {innerContent}
    </div>
  );
}

// ─── C. CenteredSection ──────────────────────────────────────────────────────

function CenteredSection({ section }: { section: Extract<CaseSection, { type: "centered" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center justify-center px-8 lg:px-[180px] pt-24 pb-12 lg:py-16" data-native-scroll="true">
      <div className="flex flex-col gap-8 lg:gap-10 max-w-[760px] w-full">

        {/* Label — above heading */}
        <motion.p
          className="text-serif-eyebrow text-[#0C0C12]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {section.label}
        </motion.p>

        {/* Heading + body */}
        <div className="flex flex-col gap-10">
          <h2
            className="text-section-heading text-[#2E2E2E]"
          >
            <RevealLine delay={0.15} inView={inView}>
              {section.heading}
            </RevealLine>
          </h2>
          <div className="flex flex-col gap-4">
            {section.body.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                className="text-body text-[#565656]"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
            {section.bullets && (
              <ul className="flex flex-col gap-1 mt-1">
                {section.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.07 }}
                  >
                    <span className="shrink-0">·</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── D. CarouselSection ──────────────────────────────────────────────────────

function CarouselSection({ section }: { section: Extract<CaseSection, { type: "carousel" }> }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const total = section.images.length;
  const go = (next: number) => setActive(((next % total) + total) % total);

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-center px-8 lg:px-[180px] py-24 lg:py-28">
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] lg:aspect-[16/9] bg-[#0C0C12]" data-dark="true">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={section.images[active]}
              alt={`Slide ${active + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.0, opacity: 0 }}
              animate={{ scale: 1.06, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                scale: { duration: 9, ease: "linear" },
                opacity: { duration: 0.45, ease: "easeInOut" },
              }}
            />
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 items-center">
            {section.images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(active - 1)}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => go(active + 1)}
              className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── E. StatsSectionBlock ────────────────────────────────────────────────────

function StatsSectionBlock({ section }: { section: Extract<CaseSection, { type: "stats" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center px-8 lg:px-[180px] pt-24 pb-12 lg:py-16" data-native-scroll="true">
      <div className="flex flex-col gap-8 lg:gap-10 w-full">

        {/* Label */}
        <motion.p
          className="text-serif-eyebrow text-[#0C0C12]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {section.label}
        </motion.p>

        {/* Two-column: heading left, body right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-32 lg:items-start">

          {/* Left — headline */}
          <h2
            className="text-section-heading text-[#2E2E2E] whitespace-pre-line"
          >
            <RevealLine delay={0.15} inView={inView}>
              {section.heading}
            </RevealLine>
          </h2>

          {/* Right — body + bullets */}
          <div className="mt-8 lg:mt-0 flex flex-col justify-start gap-4 lg:max-w-[520px]">
            {section.body.split("\n\n").map((para, i) => (
              <motion.p
                key={i}
                className={`text-body text-[#565656]${i > 0 ? " hidden lg:block" : ""}`}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
            {section.bullets && (
              <ul className="flex flex-col gap-1 mt-1">
                {section.bullets.map((b, i) => (
                  <motion.li
                    key={i}
                    className="font-sans text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2] flex gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease, delay: 0.4 + i * 0.07 }}
                  >
                    <span className="shrink-0">·</span>
                    <span>{b}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── F. RelatedProjects ──────────────────────────────────────────────────────

function RelatedProjects({
  currentSlug,
  eyebrow = "Keep Stalking",
  heading = "Recommended projects",
  prioritizeSlugs = [],
}: {
  currentSlug: string;
  eyebrow?: string;
  heading?: string;
  prioritizeSlugs?: string[];
}) {
  const others = projects.filter((p) => p.slug !== currentSlug);
  const priority = others.filter((p) => prioritizeSlugs.includes(p.slug));
  const rest = others.filter((p) => !prioritizeSlugs.includes(p.slug));
  const related = [...priority, ...rest].slice(0, 3);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  return (
    <div ref={ref} className="snap-section min-h-screen flex items-start lg:items-center px-8 lg:px-[180px] pt-24 pb-16 lg:py-32" data-native-scroll="true">
      <div className="w-full">
        {/* Header */}
        <div className="mb-10 text-center">
          <motion.p
            className="text-serif-eyebrow text-[#0C0C12]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            {eyebrow}
          </motion.p>
          <h2 className="text-section-title text-[#2E2E2E] mt-1">
            <RevealLine delay={0.15} inView={inView}>{heading}</RevealLine>
          </h2>
        </div>

        {/* Desktop: 3 full-width cards */}
        <div className="hidden lg:flex gap-6">
          {related.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease, delay: 0.25 + i * 0.12 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="lg:hidden flex flex-col items-center gap-6">
          <div className="relative w-full max-w-[302px] overflow-hidden">
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
                <ProjectCard project={related[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between w-full max-w-[302px]">
            <p className="text-ui text-[#565656]">
              {String(active + 1).padStart(2, "0")}/{String(related.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => go(Math.max(0, active - 1))}
                disabled={active === 0}
                className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] disabled:opacity-30 hover:border-[#2E2E2E]/40 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => go(Math.min(related.length - 1, active + 1))}
                disabled={active === related.length - 1}
                className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] disabled:opacity-30 hover:border-[#2E2E2E]/40 transition-colors"
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section dispatcher ───────────────────────────────────────────────────────

function CaseSectionBlock({ section }: { section: CaseSection }) {
  switch (section.type) {
    case "split":
      return (
        <>
          <SplitSection section={section} />
          {section.video
            ? <FullScreenImage src={section.image ?? ""} alt={section.heading} video={section.video} mobileNaturalAspect />
            : section.image
              ? <FullScreenImage src={section.image} alt={section.heading} image2={section.image2} />
              : null}
        </>
      );
    case "centered":
      return <CenteredSection section={section} />;
    case "carousel":
      return section.images.length > 0 ? <CarouselSection section={section} /> : null;
    case "stats":
      return <StatsSectionBlock section={section} />;
    default:
      return null;
  }
}

// ─── Root export ─────────────────────────────────────────────────────────────

const GXM_OVERVIEW_SLUG = "gxm";
const GXM_PART1_SLUG = "gxm-building-alignment-before-software";
const GXM_PART2_SLUG = "gxm-validate-before-you-build";
const GXM_ALL_SLUGS = [GXM_OVERVIEW_SLUG, GXM_PART1_SLUG, GXM_PART2_SLUG];

export default function CaseTemplate({ caseData }: { caseData: CaseData }) {
  const isGXMOverview = caseData.slug === GXM_OVERVIEW_SLUG;
  const isGXMPart = caseData.slug === GXM_PART1_SLUG || caseData.slug === GXM_PART2_SLUG;

  let relatedEyebrow = "Keep Stalking";
  let relatedHeading = "Recommended projects";
  let relatedPriority: string[] = [];

  if (isGXMOverview) {
    relatedEyebrow = "Go deeper";
    relatedHeading = "Explore each phase in detail";
    relatedPriority = [GXM_PART1_SLUG, GXM_PART2_SLUG];
  } else if (isGXMPart) {
    relatedEyebrow = "Continue your reading";
    relatedHeading = "More on this digital transformation";
    relatedPriority = GXM_ALL_SLUGS.filter((s) => s !== caseData.slug);
  }

  return (
    <article>
      <CaseHero caseData={caseData} />
      {caseData.heroImages && caseData.heroImages.length > 1
        ? <HeroSlideshow images={caseData.heroImages} alt={caseData.title} />
        : caseData.heroImage
          ? <FullScreenImage src={caseData.heroImage} alt={caseData.title} video={caseData.heroVideo} />
          : null
      }

      {caseData.sections.map((section, i) => (
        <CaseSectionBlock key={i} section={section} />
      ))}

      <RelatedProjects
        currentSlug={caseData.slug}
        eyebrow={relatedEyebrow}
        heading={relatedHeading}
        prioritizeSlugs={relatedPriority}
      />
    </article>
  );
}
