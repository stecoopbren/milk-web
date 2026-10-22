"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import Lottie from "lottie-react";
import SectionReveal from "./SectionReveal";

export default function CTASection() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lottieData, setLottieData] = useState<any>(null);

  useEffect(() => {
    fetch("/Formula/18.json")
      .then((r) => r.json())
      .then(setLottieData);
  }, []);

  function openContact() {
    track("contact_modal_opened", { source: "cta" });
    window.dispatchEvent(new CustomEvent("milk:open-contact"));
  }

  return (
    <SectionReveal id="cta" noExitBlur style={{ minHeight: "calc(100vh - 540px)" }}>
      <div className="flex flex-col items-center justify-center px-8 text-center lg:px-[180px]">
        {lottieData && (
          <Lottie
            animationData={lottieData}
            loop
            style={{ width: 360, height: 360, marginBottom: -16 }}
          />
        )}

        <div className="flex flex-col items-center" style={{ gap: 16 }}>
          <span className="text-serif-eyebrow block text-[#2E2E2E]">Still got questions?</span>

          <h2 className="text-section-title text-center text-[#0C0C12]">
            Don&apos;t be shy, say hi!
          </h2>
        </div>

        <motion.button
          onClick={openContact}
          className="inline-flex items-center gap-2 rounded-full font-sans text-[15px] font-medium tracking-[-0.45px] text-white"
          style={{
            marginTop: 16,
            background: "#1a1a1a",
            padding: "14px 28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
          whileHover={{ opacity: 0.82 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          Break the Ice →
        </motion.button>
      </div>
    </SectionReveal>
  );
}
