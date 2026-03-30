"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { RevealLine } from "./animations";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

const projects = [
  {
    id: 0,
    category: "REAL ESTATE PROJECT",
    title: "Designing a thriving regenerative community in the jungle.",
    description: "An ecological community design blending architecture with nature in the heart of the tropics.",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 1,
    category: "BRAND IDENTITY",
    title: "Building a bold identity for a new generation of thinkers.",
    description: "A complete visual identity system crafted for a modern, forward-thinking creative company.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    category: "PRODUCT DESIGN",
    title: "Crafting a seamless digital product from zero to launch.",
    description: "End-to-end UX/UI design for a digital platform, from early research through to polished launch.",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
  },
];

type Project = typeof projects[0];

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="glass-border-animated rounded-2xl overflow-hidden w-full h-full flex flex-col"
      animate={{ y: hovered ? -6 : 0 }}
      transition={{ duration: 0.35, ease }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Image at top — full-bleed, clipped by card's overflow-hidden */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={project.img}
          alt={project.title}
          className="h-full w-full object-cover"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <a
          href="#"
          className="absolute bottom-0 left-0 flex items-center gap-1.5 p-4 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-sans text-[14px] font-medium tracking-[-0.28px]">View Case</span>
          <ArrowUpRight />
        </a>
      </div>

      {/* Text below — 24px padding all around, flex-1 fills remaining height */}
      <div className="p-6 flex-1">
        <p className="font-mono text-[12px] text-[#565656] tracking-[-0.36px] mb-3">
          {project.category}
        </p>
        <h3 className="font-sans font-medium text-[#0C0C12] text-[20px] tracking-[-1px] leading-tight">
          {project.title}
        </h3>
        <p className="mt-2 font-sans text-[#565656] text-[14px] tracking-[-0.28px] leading-[1.3]">
          {project.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  return (
    <SectionReveal id="portfolio" className="px-8 lg:px-[180px]">
      <div ref={ref} className="flex flex-col gap-11 w-full py-24">

        {/* Header — mobile */}
        <div className="lg:hidden flex flex-col gap-1 w-full">
          <RevealLine className="font-mono text-[#565656] text-[16px] tracking-[-0.48px] leading-6" delay={0.1} inView={inView}>
            Keep stalking us
          </RevealLine>
          <h2 className="font-sans font-medium text-[#2F2F2F] text-[24px] tracking-[-1.2px] leading-[1.2]">
            <RevealLine delay={0.22} inView={inView}>Featured projects</RevealLine>
          </h2>
        </div>

        {/* Header — desktop */}
        <div className="hidden lg:flex items-end justify-between w-full">
          <div className="flex flex-col gap-2">
            <RevealLine className="font-mono text-[#565656] text-[20px] tracking-[-0.6px] leading-6" delay={0.1} inView={inView}>
              Keep stalking us
            </RevealLine>
            <h2 className="font-sans font-medium text-[#2F2F2F] text-[32px] tracking-[-1.92px] leading-none">
              <RevealLine delay={0.22} inView={inView}>Featured projects</RevealLine>
            </h2>
          </div>
        </div>

        {/* Mobile: carousel */}
        <div className="lg:hidden w-full flex flex-col items-center gap-6">
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

          <div className="flex items-center justify-between w-full max-w-[302px]">
            <p className="font-mono text-[#565656] text-[16px] tracking-[-0.48px] leading-6">
              0{active + 1}/0{projects.length}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => go(Math.max(0, active - 1))}
                disabled={active === 0}
                className="glass-border-animated rounded-2xl p-2 disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => go(Math.min(projects.length - 1, active + 1))}
                disabled={active === projects.length - 1}
                className="glass-border-animated rounded-2xl p-2 disabled:opacity-30 transition-opacity"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: 3 cards in a row — full width, items-stretch for equal heights */}
        <div className="hidden lg:flex gap-6 w-full items-stretch">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.2 + i * 0.12 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>

      </div>
    </SectionReveal>
  );
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F2F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
