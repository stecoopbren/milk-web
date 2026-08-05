"use client";

/**
 * ProjectsSectionFloatingCards
 * -----------------------------
 * 3D cinematic tunnel gallery with "Featured Work" headline centered behind
 * two opposing card streams (desktop) and a single marquee strip (mobile).
 *
 * Stored for reuse — currently replaced by a new version of ProjectsSection.
 * To restore: swap the import in page.tsx back to this file.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export type Project = {
  id: number;
  slug: string;
  category: string;
  title: string;
  description: string;
  img: string;
  tall?: boolean;
};

const projects: Project[] = [
  {
    id: 0,
    slug: "regenerative-community",
    category: "REAL ESTATE PROJECT",
    title: "Designing a thriving regenerative community in the jungle.",
    description: "Full community master plan delivered in 10 weeks. Architecture, brand, and go-to-market strategy aligned from day one.",
    img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 1,
    slug: "bold-identity",
    category: "BRAND IDENTITY",
    title: "Building a bold identity for a new generation of thinkers.",
    description: "Complete identity system: logo, type, color, and motion. Shipped in 4 weeks and ready to scale across every touchpoint.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    slug: "product-launch",
    category: "PRODUCT DESIGN",
    title: "Crafting a seamless digital product from zero to launch.",
    description: "Zero to launch in 8 weeks. Research, UX, UI, and handoff: the team shipped on time with a product users actually wanted.",
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    slug: "brand-system",
    category: "BRAND SYSTEM",
    title: "A unified brand system for a global SaaS platform.",
    description: "End-to-end identity: logo, typography, colour, and component library, delivered in six weeks.",
    img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    slug: "service-redesign",
    category: "SERVICE DESIGN",
    title: "Reducing friction in a critical government service.",
    description: "Research to redesign in twelve weeks, cutting average completion time by 40%.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    slug: "ai-interface",
    category: "AI PRODUCT",
    title: "Designing the interface for an AI-powered analytics tool.",
    description: "From zero to beta in ten weeks with a design system built to scale.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
  },
];

export { projects };

// ── ProjectCard ───────────────────────────────────────────────────────────────
export function ProjectCard({
  project,
  flipDelay = 0,
  inView,
}: {
  project: Project;
  flipDelay?: number;
  inView: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hintState, setHintState] = useState<"idle" | "hinting" | "done">("idle");

  useEffect(() => {
    if (!inView || hintState !== "idle") return;
    let t2: ReturnType<typeof setTimeout>;
    const t1 = setTimeout(() => {
      setHintState("hinting");
      t2 = setTimeout(() => setHintState("done"), 1000);
    }, 1100 + flipDelay * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView, flipDelay, hintState]);

  const isHinting = hintState === "hinting" && !isFlipped;

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: "1200px", aspectRatio: "3/4" }}
      onClick={() => setIsFlipped(f => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : isHinting ? [0, 35, 0] : 0 }}
        whileHover={!isHinting && !isFlipped ? { rotateY: 30 } : {}}
        transition={
          isHinting
            ? { rotateY: { duration: 1.0, ease: "easeInOut", times: [0, 0.45, 1] } }
            : { rotateY: { duration: 0.75, ease: [0.4, 0, 0.2, 1] } }
        }
      >
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
            <span className="font-mono text-[13px] text-white/70 tracking-[-0.39px]">
              {project.category}
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-white border border-black/[0.07] rounded-2xl flex flex-col p-8 gap-4"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-start justify-between w-full">
            <span className="font-mono text-[13px] text-[#0C0C12] tracking-[-0.39px]">
              {project.category}
            </span>
            <a
              href={"/cases/" + project.slug}
              onClick={e => e.stopPropagation()}
              className="text-[#B0B0B0] hover:text-[#0C0C12] transition-colors"
            >
              <ArrowUpRight />
            </a>
          </div>
          <h3 className="font-sans font-medium text-[#0C0C12] text-[22px] tracking-[-1.1px] leading-[1.1]">
            {project.title}
          </h3>
          <p className="font-sans font-medium text-[#565656] text-[14px] tracking-[-0.39px] leading-[1.4]">
            {project.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Tunnel card ───────────────────────────────────────────────────────────────
const CARD_W = 240;
const CARD_H = 320;
const SPEED  = 0.000013; // progress per ms — full cycle ≈ 77 s

function TunnelCard({
  project,
  initialT,
  direction,
  yOffset,
}: {
  project: Project;
  initialT: number;
  direction: "left" | "right";
  yOffset: number;
}) {
  const t = useMotionValue(initialT);

  useAnimationFrame((_, delta) => {
    t.set((t.get() + delta * SPEED) % 1);
  });

  const z = useTransform(t, [0, 1], [-1400, 600]);

  const xFrom = direction === "left" ?  1100 : -1100;
  const xTo   = direction === "left" ? -1100 :  1100;
  const x = useTransform(t, [0, 1], [xFrom, xTo]);

  const y = useTransform(
    t,
    [0, 0.42, 1],
    [yOffset * 1.1, yOffset * 0.9, yOffset * 1.1],
  );

  const opacity    = useTransform(t, [0, 0.06, 0.80, 1], [0, 1, 1, 0]);
  const dimOpacity = useTransform(t, [0, 0.55, 1], [0.65, 0, 0]);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        width: CARD_W,
        height: CARD_H,
        x, y, z, opacity,
        left: "50%",
        top: "50%",
        marginLeft: -CARD_W / 2,
        marginTop: -CARD_H / 2,
        borderRadius: 18,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 80px rgba(255,255,255,0.18), 0 28px 80px rgba(0,0,0,0.55)",
        transition: { duration: 0.35, ease },
      }}
      onClick={() => { window.location.href = `/cases/${project.slug}`; }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 18, overflow: "hidden", position: "relative" }}>
        <img
          src={project.img}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "#000", opacity: dimOpacity }} />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 18 }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1, transition: { duration: 0.25 } }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.22) 0%, transparent 65%)" }} />
        </motion.div>
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
        >
          <p className="font-mono text-[10px] text-white/55 tracking-[-0.2px] mb-0.5">{project.category}</p>
          <p className="font-sans font-medium text-white text-[13px] tracking-[-0.4px] leading-tight">{project.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProjectsSectionFloatingCards() {
  const reducedMotion = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const rotY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-22, 22]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 18 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawMouseX.set((e.clientX - r.left) / r.width  - 0.5);
    rawMouseY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [rawMouseX, rawMouseY]);

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  }, [rawMouseX, rawMouseY]);

  const streamA = projects.slice(0, 3).map((p, i) => ({
    project: p, initialT: i / 3, direction: "left" as const, yOffset: -380,
  }));
  const streamB = projects.slice(3).map((p, i) => ({
    project: p, initialT: (i / 3) + 1 / 6, direction: "right" as const, yOffset: 380,
  }));

  const showTunnel = !isMobile && !reducedMotion;

  return (
    <section
      id="portfolio"
      data-free-scroll="true"
      className="snap-section relative z-10"
      style={{ height: "100vh", background: "#FFFFFF", overflow: "hidden" }}
    >
      {showTunnel && (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 50 }}>
            <h1
              className="font-sans font-medium text-[#0C0C12] leading-[0.85] select-none text-center"
              style={{ fontSize: "clamp(56px, 8vw, 100px)", letterSpacing: "-3.36px" }}
            >
              Featured<br />Work
            </h1>
          </div>

          <div
            className="absolute inset-0"
            style={{ perspective: "1400px", zIndex: 10 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div className="absolute inset-0" style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
              {[...streamA, ...streamB].map(({ project, initialT, direction, yOffset }) => (
                <TunnelCard key={project.id} project={project} initialT={initialT} direction={direction} yOffset={yOffset} />
              ))}
            </motion.div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #FFFFFF 100%)", zIndex: 20 }}
            />
          </div>

          <div className="absolute bottom-8 right-[180px] pointer-events-auto" style={{ zIndex: 30 }}>
            <a href="/portfolio" className="font-sans text-[15px] text-[#565656] tracking-[-0.45px] hover:opacity-50 transition-opacity" style={{ textDecoration: "none" }}>
              See All Work
            </a>
          </div>
        </>
      )}

      {!showTunnel && (
        <>
          <style>{`
            @keyframes marquee-left {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>

          <div className="absolute left-8 right-8" style={{ top: 108, zIndex: 10 }}>
            <h1
              className="font-sans font-medium text-[#0C0C12] leading-[0.85] select-none"
              style={{ fontSize: "clamp(56px, 16vw, 88px)", letterSpacing: "-3px" }}
            >
              Featured<br />Work
            </h1>
          </div>

          <div className="absolute left-0 right-0 overflow-hidden" style={{ top: "52vh", zIndex: 10 }}>
            <div style={{ display: "flex", gap: 12, width: "max-content", animation: "marquee-left 35s linear infinite" }}>
              {[...projects, ...projects].map((project, i) => (
                <MobileCard key={i} project={project} />
              ))}
            </div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to right, #FFFFFF 0%, transparent 12%, transparent 88%, #FFFFFF 100%)" }}
            />
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-auto" style={{ zIndex: 20 }}>
            <a href="/portfolio" className="font-sans text-[15px] text-[#565656] tracking-[-0.45px] hover:opacity-50 transition-opacity" style={{ textDecoration: "none" }}>
              See All Work
            </a>
          </div>
        </>
      )}
    </section>
  );
}

function MobileCard({ project }: { project: Project }) {
  return (
    <a
      href={`/cases/${project.slug}`}
      style={{ display: "block", width: 160, height: 213, borderRadius: 14, overflow: "hidden", position: "relative", flexShrink: 0, textDecoration: "none" }}
    >
      <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
        <p className="font-mono text-[9px] text-white/55 tracking-[-0.2px] mb-0.5">{project.category}</p>
        <p className="font-sans font-medium text-white text-[11px] tracking-[-0.3px] leading-tight">{project.title}</p>
      </div>
    </a>
  );
}

function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}
