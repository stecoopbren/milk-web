"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiquidWave from "./LiquidWave";

const BASE = "#FFFFFF";

export default function LiquidBackground() {
  const [vh, setVh] = useState(900);
  useEffect(() => { setVh(window.innerHeight); }, []);

  const { scrollY } = useScroll();

  // Fade the liquid out between end of section 3 (About Milk) and start of section 4
  const opacity = useTransform(scrollY, [vh * 2.4, vh * 3.0], [1, 0]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: BASE, opacity: 0.8 }}>
      <motion.div style={{ position: "absolute", inset: 0, opacity }}>
        <LiquidWave />
      </motion.div>
    </div>
  );
}
