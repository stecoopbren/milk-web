"use client";

/**
 * CinematicBoard
 * ──────────────
 * Animates a virtual "camera" across a large canvas image (FigJam board,
 * journey map, etc.) through a sequence of named shots. Each shot defines
 * where the camera rests, how long it holds, and an optional annotation label.
 *
 * Also renders up to 3 animated collaboration cursors to simulate live work.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Types ──────────────────────────────────────────────────────────────────────

export type BoardShot = {
  /** Horizontal pan in %. Negative = pan left, positive = pan right. */
  x: number;
  /** Vertical pan in %. Negative = pan up, positive = pan down. */
  y: number;
  /** Zoom level. 1 = fit to container width. */
  scale: number;
  /** Seconds to hold this shot before moving to the next. */
  hold: number;
  /** Optional label that fades in as a frosted-glass annotation. */
  label?: string;
};

export type CursorDef = {
  name: string;
  color: string;
  /** Path as [x%, y%] pairs — relative to container dimensions. */
  path: [number, number][];
  /** Seconds per keyframe step. */
  stepDuration: number;
  /** Seconds before this cursor begins moving. */
  startDelay: number;
};

interface CinematicBoardProps {
  src: string;
  shots?: BoardShot[];
  cursors?: CursorDef[];
  /** Container height in px. Default 560. */
  height?: number;
  /** Background behind the image. Default #0C0C12. */
  bg?: string;
}

// ── Preset shots for a wide FigJam board (override per case) ──────────────────

export const DEFAULT_SHOTS: BoardShot[] = [
  { x: 0,   y: 0,   scale: 1.05, hold: 3.0 },
  { x: 18,  y: 8,   scale: 2.1,  hold: 5.0, label: "Workflow Engine" },
  { x: -8,  y: -10, scale: 2.4,  hold: 5.5, label: "Future State Flow" },
  { x: -20, y: 12,  scale: 2.0,  hold: 4.5, label: "MVP Flow Map" },
  { x: 0,   y: 0,   scale: 1.2,  hold: 3.0 },
];

export const DEFAULT_CURSORS: CursorDef[] = [
  { name: "Steven", color: "#FF3377", path: [[25, 50], [42, 32], [58, 55], [38, 68]], stepDuration: 3.2, startDelay: 0.0 },
  { name: "Lena",   color: "#FACC15", path: [[68, 22], [55, 40], [72, 58], [60, 35]], stepDuration: 3.8, startDelay: 0.8 },
  { name: "Marcus", color: "#3B82F6", path: [[15, 30], [30, 55], [20, 72], [35, 45]], stepDuration: 4.1, startDelay: 1.4 },
  { name: "Elise",  color: "#22C55E", path: [[78, 45], [62, 28], [80, 18], [70, 60]], stepDuration: 3.5, startDelay: 2.0 },
  { name: "Jordan", color: "#A855F7", path: [[48, 70], [60, 50], [45, 35], [55, 65]], stepDuration: 4.4, startDelay: 1.0 },
  { name: "Hugo",   color: "#F97316", path: [[82, 70], [72, 48], [88, 30], [75, 65]], stepDuration: 3.9, startDelay: 2.6 },
];

// ── Collaboration cursor ───────────────────────────────────────────────────────

function Cursor({ def, w, h }: { def: CursorDef; w: number; h: number }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      const interval = setInterval(
        () => setIdx(i => (i + 1) % def.path.length),
        def.stepDuration * 1000,
      );
      return () => clearInterval(interval);
    }, def.startDelay * 1000);
    return () => clearTimeout(t);
  }, [def]);

  if (!visible || w === 0) return null;

  const [px, py] = def.path[idx];

  return (
    <motion.div
      animate={{ x: (px / 100) * w, y: (py / 100) * h }}
      transition={{ duration: def.stepDuration * 0.85, ease }}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 10 }}
    >
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
        <path d="M2 2l14 8-7 2-4 8L2 2z" fill={def.color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div style={{
        position: "absolute", top: 18, left: 14,
        background: def.color, color: "white",
        fontSize: 11, fontFamily: "DM Sans, sans-serif", fontWeight: 600,
        padding: "2px 7px", borderRadius: 999, whiteSpace: "nowrap", letterSpacing: "-0.2px",
      }}>
        {def.name}
      </div>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CinematicBoard({
  src,
  shots = DEFAULT_SHOTS,
  cursors = DEFAULT_CURSORS,
  height = 560,
  bg = "#0C0C12",
}: CinematicBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const [shotIdx, setShotIdx] = useState(0);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Measure container for cursor x/y math
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Advance through shots once in view
  useEffect(() => {
    if (!inView) return;
    let t: ReturnType<typeof setTimeout>;
    const advance = (current: number) => {
      t = setTimeout(() => {
        const next = (current + 1) % shots.length;
        setShotIdx(next);
        advance(next);
      }, shots[current].hold * 1000);
    };
    advance(0);
    return () => clearTimeout(t);
  }, [inView, shots]);

  const shot = shots[shotIdx];

  // Image is rendered at 200% width so there is overflow for panning.
  // x/y offsets move the image relative to that overflow space.
  const tx = `calc(-25% + ${shot.x * 0.5}%)`;
  const ty = `calc(-25% + ${shot.y * 0.5}%)`;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      style={{ position: "relative", width: "100%", height, background: bg, overflow: "hidden" }}
    >
      {/* ── Camera layer: image pans + zooms to each shot ── */}
      <motion.div
        animate={{ x: tx, y: ty, scale: shot.scale }}
        transition={{ duration: 2.4, ease }}
        style={{ position: "absolute", width: "200%", height: "100%", transformOrigin: "center center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

        {/* Radial vignette — draws the eye to the center of each shot */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }} />
      </motion.div>

      {/* ── Collaboration cursors — fixed to container coords, not image ── */}
      {inView && cursors.map((def, i) => (
        <Cursor key={i} def={def} w={size.w} h={size.h} />
      ))}

      {/* ── Shot annotation label ── */}
      <AnimatePresence mode="wait">
        {shot.label && (
          <motion.div
            key={shot.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease }}
            style={{
              position: "absolute", bottom: 32, left: 32, zIndex: 20,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 8, padding: "6px 14px",
              fontFamily: "DM Mono, monospace", fontSize: 11, fontWeight: 500,
              color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em", textTransform: "uppercase",
            }}
          >
            {shot.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom fade — blends into page background ── */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 5, pointerEvents: "none",
        background: `linear-gradient(to bottom, transparent, ${bg})`,
      }} />
    </motion.div>
  );
}
