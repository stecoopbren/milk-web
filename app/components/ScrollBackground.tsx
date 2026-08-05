"use client";

import { useEffect } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function ScrollBackground() {
  const { scrollY } = useScroll();
  // Interpolate from hero colour to page background over ~one viewport of scroll
  // Transition completes well within the hero — any section below is pure #FFFFFF
  const bgColor = useTransform(scrollY, [0, 300], ["#EDECEC", "#FFFFFF"]);

  // Set the initial colour immediately on mount so there's no flash
  useEffect(() => {
    document.body.style.backgroundColor = "#EDECEC";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  // Sync every change to the body — fully reversible, stops when scroll stops
  useMotionValueEvent(bgColor, "change", (color) => {
    document.body.style.backgroundColor = color;
  });

  return null;
}
