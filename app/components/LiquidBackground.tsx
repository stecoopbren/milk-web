"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiquidWave from "./LiquidWave";

const BASE = "#FFFFFF";

export default function LiquidBackground() {
  const [vh, setVh] = useState(900);
  useEffect(() => { setVh(window.innerHeight); }, []);

  const { scrollY } = useScroll();

  // Fade the liquid out between end of section 2 and start of section 3
  const opacity = useTransform(scrollY, [vh * 1.6, vh * 2.1], [1, 0]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: BASE, opacity: 0.8 }}>
      <motion.div style={{ position: "absolute", inset: 0, opacity }}>
        <LiquidWave />
      </motion.div>
    </div>
  );
}
