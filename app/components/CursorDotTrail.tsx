"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const DOT_SIZE   = 6;
const RING_SIZE  = 32;
const COLOR_DARK = "#0C0C12";
const COLOR_LIGHT = "#FFFFFF";

export default function CursorDotTrail() {
  const [visible,  setVisible]  = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [onDark,   setOnDark]   = useState(false);

  // Raw cursor position
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);

  // Ring lags behind with a spring
  const rx = useSpring(mx, { stiffness: 380, damping: 28, mass: 0.25 });
  const ry = useSpring(my, { stiffness: 380, damping: 28, mass: 0.25 });

  // Offset by half the element size so they're centered on the cursor
  const dotX  = useTransform(mx, v => v - DOT_SIZE  / 2);
  const dotY  = useTransform(my, v => v - DOT_SIZE  / 2);
  const ringX = useTransform(rx, v => v - RING_SIZE / 2);
  const ringY = useTransform(ry, v => v - RING_SIZE / 2);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovering(!!(el?.closest("a, button, [role=button]")));
      setOnDark(!!(el?.closest("[data-dark='true']")));
    };
    const onLeave  = () => setVisible(false);
    const onDown   = () => setClicking(true);
    const onUp     = () => setClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my]);

  const ringScale = clicking ? 0.75 : hovering ? 1.5 : 1;
  const color = onDark ? COLOR_LIGHT : COLOR_DARK;

  return (
    <>
      <style>{`@media (pointer: fine) { *, *::before, *::after { cursor: none !important; } }`}</style>

      {/* Dot — snaps to cursor exactly */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0, backgroundColor: color }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width:  DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          x: dotX,
          y: dotY,
        }}
      />

      {/* Ring — springs after the cursor */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0, scale: ringScale, borderColor: color }}
        transition={{ opacity: { duration: 0.2, ease: "easeOut" }, scale: { type: "spring", stiffness: 200, damping: 20 }, borderColor: { duration: 0.2 } }}
        style={{
          position: "fixed",
          top: 0, left: 0,
          width:  RING_SIZE,
          height: RING_SIZE,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          backgroundColor: "transparent",
          pointerEvents: "none",
          zIndex: 9998,
          x: ringX,
          y: ringY,
        }}
      />
    </>
  );
}
