"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export type OrbitItem = {
  title: string;
  role: string;
  year: string;
  image: string;
  href: string;
  tag?: string;
};

// ── Card ──────────────────────────────────────────────────────────────────────
// Card outer is a plain div with static CSS transform so it correctly places on
// the cylinder: rotateY(angle) translateZ(radius). Framer Motion is only used
// for the inner animated visual properties (scale, opacity, brightness).
function OrbitCard({
  item,
  angle,
  radius,
  cardW,
  cardH,
  rotation,
}: {
  item: OrbitItem;
  angle: number;
  radius: number;
  cardW: number;
  cardH: number;
  rotation: MotionValue<number>;
}) {
  // How far this card is from the front face at any given rotation
  const facing = useTransform(rotation, (r) => {
    let a = ((angle + r) % 360 + 360) % 360;
    if (a > 180) a -= 360;
    return a; // -180..180, 0 = front
  });

  const scale   = useTransform(facing, [-90, 0, 90], [0.88, 1.0, 0.88]);
  const opacity = useTransform(facing, [-95, -55, 0, 55, 95], [0, 0.88, 1, 0.88, 0]);
  const brt     = useTransform(
    facing,
    (a) => `brightness(${(0.5 + 0.5 * Math.max(0, Math.cos((a * Math.PI) / 180))).toFixed(3)})`,
  );

  const outerRef = useRef<HTMLDivElement>(null);

  const updateWidth = (f: number) => {
    if (!outerRef.current) return;
    const t = Math.max(0, 1 - Math.abs(f) / 90);
    const w = lerp(cardW * 0.88, cardW * 2 + 400, t * t);
    const z = radius + t * 120;
    outerRef.current.style.width     = `${w}px`;
    outerRef.current.style.left      = `${-w / 2}px`;
    outerRef.current.style.transform = `rotateY(${angle}deg) translateZ(${z}px)`;
  };

  useMotionValueEvent(facing, "change", updateWidth);
  useLayoutEffect(() => { updateWidth(facing.get()); }, []);

  return (
    // Outer: plain div — raw CSS `transform: rotateY(angle) translateZ(radius)`
    // This is the ONLY correct way to place elements on a CSS 3D cylinder.
    <div
      ref={outerRef}
      style={{
        position: "absolute",
        width: cardW,
        height: cardH,
        top: -cardH / 2,
        left: -cardW / 2,
      }}
    >
      {/* Inner: Framer Motion handles only visual animation */}
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          scale,
          opacity,
          filter: brt,
          borderRadius: 14,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14)",
        }}
        whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
        onClick={() => { window.location.href = item.href; }}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.54) 0%, rgba(0,0,0,0.06) 42%, rgba(0,0,0,0.06) 58%, rgba(0,0,0,0.68) 100%)",
          }}
        />

        {/* Top: title + metadata */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.35,
              letterSpacing: "-0.3px",
              maxWidth: "56%",
              fontFamily: "var(--font-sans, sans-serif)",
            }}
          >
            {item.title}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, textAlign: "right", flexShrink: 0, maxWidth: "42%", minWidth: 0 }}>
            {[{ label: "Role", value: item.role }, { label: "Year", value: item.year }].map(({ label, value }) => (
              <div key={label} style={{ minWidth: 0 }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 7.5, letterSpacing: "0.6px", textTransform: "uppercase", fontFamily: "var(--font-dm-mono, monospace)", marginBottom: 1 }}>
                  {label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 8.5, letterSpacing: "0.3px", textTransform: "uppercase", fontFamily: "var(--font-dm-mono, monospace)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: tag */}
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 8.5, letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-dm-mono, monospace)" }}>
            {item.tag ?? ""}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
export default function OrbitGallery({
  items,
  rotation,
  radius = 400,
  cardW = 220,
  cardH,
}: {
  items: OrbitItem[];
  rotation: MotionValue<number>;
  radius?: number;
  cardW?: number;
  cardH?: number;
}) {
  const N        = items.length;
  const h        = cardH ?? Math.round(cardW * (16 / 10)); // tall portrait
  const ringRef  = useRef<HTMLDivElement>(null);

  // Drive ring rotation directly on the DOM — bypasses Framer Motion transform
  // ordering issues that would break the 3D cylinder positioning.
  useMotionValueEvent(rotation, "change", (r) => {
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${r}deg)`;
    }
  });

  // Sync on mount
  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${rotation.get()}deg)`;
    }
  }, [rotation]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
    >
      {/* Perspective container — cylinder center sits at 50% */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          perspective: "1100px",
        }}
      >
        {/* Ring — plain div, transform driven by ref via useMotionValueEvent */}
        <div
          ref={ringRef}
          style={{
            transformStyle: "preserve-3d",
            position: "relative",
            width: 0,
            height: 0,
          }}
        >
          {items.map((item, i) => (
            <OrbitCard
              key={i}
              item={item}
              angle={35 * i}
              radius={radius}
              cardW={cardW}
              cardH={h}
              rotation={rotation}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
