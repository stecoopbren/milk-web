"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RevealLine } from "./animations";
import { ProjectCard, projects as allProjects } from "./ProjectsSection";

const projects = allProjects.filter((p) => !p.hidden);

const ease = [0.22, 1, 0.36, 1] as const;

export default function PortfolioHero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  return (
    <div className="snap-section flex min-h-screen flex-col">
      {/* Hero header */}
      <div
        ref={ref}
        className="flex flex-col items-center gap-4 px-8 pt-[180px] pb-16 text-center lg:px-[180px]"
        style={{
          background: "linear-gradient(to bottom, rgba(224,224,224,0.2) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <RevealLine className="text-ui text-[#2E2E2E]" delay={0.1} inView={inView}>
          Our Portfolio
        </RevealLine>

        <h1
          className="font-sans leading-[0.85] font-medium tracking-[-3.36px] text-[#2E2E2E]"
          style={{ fontSize: "clamp(36px, 5.5vw, 56px)" }}
        >
          <RevealLine delay={0.22} inView={inView}>
            Crafted with love
          </RevealLine>
          <RevealLine delay={0.32} inView={inView}>
            for a better world.
          </RevealLine>
        </h1>

        <motion.p
          className="max-w-[480px] font-sans text-[16px] leading-[1.2] tracking-[-0.32px] text-[#565656]"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.45 }}
        >
          We think your project should totally be the next one featured here.
        </motion.p>
      </div>

      {/* Mobile: carousel */}
      <div className="flex flex-col items-center gap-6 px-8 pb-16 lg:hidden">
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
              <ProjectCard project={projects[active]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex w-full max-w-[302px] items-center justify-between">
          <p className="text-ui text-[#2E2E2E]">
            0{active + 1}/0{projects.length}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => go(Math.max(0, active - 1))}
              disabled={active === 0}
              className="inline-flex items-center justify-center rounded-full border border-[#2E2E2E]/15 p-2.5 text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40 disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => go(Math.min(projects.length - 1, active + 1))}
              disabled={active === projects.length - 1}
              className="inline-flex items-center justify-center rounded-full border border-[#2E2E2E]/15 p-2.5 text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40 disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop: 3-column grid */}
      <div className="hidden flex-col items-center gap-8 px-[180px] pb-24 lg:flex">
        <div className="grid w-full max-w-[1062px] grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex flex-col"
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.12 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>

        {/* Project count */}
        <div className="flex w-full max-w-[1062px] items-center">
          <p className="text-ui text-[#2E2E2E]">{projects.length} projects</p>
        </div>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
