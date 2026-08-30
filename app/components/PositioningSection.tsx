"use client";

import { motion, type Variants } from "framer-motion";
import LiquidWave from "./LiquidWave";

// initX: how far toward center the side cards start (positive = from right, negative = from left)
// initRotate: side cards start flat (0°) and rotate into their final angle
const fanSlots = [
  { rotate: -6, initX: 72,  initRotate: 0, ty: 24, widthPct: 38, mr: -32, ml: 0,   zIndex: 10, delay: 0.55 },
  { rotate:  0, initX: 0,   initRotate: 0, ty: -8, widthPct: 42, mr: 0,   ml: 0,   zIndex: 20, delay: 0.2  },
  { rotate:  6, initX: -72, initRotate: 0, ty: 24, widthPct: 38, mr: 0,   ml: -32, zIndex: 10, delay: 0.7  },
];

const photos = [
  { src: "/IMG_7839_VSCO.JPG", alt: "Steven in Paris" },
  { src: "/FullSizeRender_VSCO.JPG", alt: "Steven at Golden Gate" },
  { src: "/B37FFF98-05DF-4025-BDF8-7415F841280C.JPG", alt: "Steven at Figma Config" },
];

const textVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fanContainerVariants: Variants = {
  hidden: {},
  visible: { transition: {} },
};

const fanCardVariants: Variants = {
  hidden: (slot: (typeof fanSlots)[number]) => ({
    opacity: 0,
    x: slot.initX,
    y: slot.ty,
    rotate: slot.initRotate,
    scale: slot.zIndex === 20 ? 1 : 0.88,
    filter: "blur(3px)",
  }),
  visible: (slot: (typeof fanSlots)[number]) => ({
    opacity: 1,
    x: 0,
    y: slot.ty,
    rotate: slot.rotate,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: slot.delay },
  }),
};

export default function PositioningSection() {
  return (
    <section
      id="about-us"
      className="snap-section relative flex flex-col items-center justify-start gap-12 px-8 lg:px-[180px]"
      data-native-scroll="true"
      style={{ minHeight: "100vh", height: "auto", paddingTop: 132, paddingBottom: 60, position: "relative", background: "#FAFAFA" }}
    >
      {/* Liquid background — continuously animated so waves stay visible */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <LiquidWave loopSweep={true} />
      </div>

      {/* Text block */}
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        style={{ position: "relative", zIndex: 1 }}
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <p className="text-serif-eyebrow text-[#B0B0B0]">( About me &amp; Milk ® )</p>

        <h2 className="text-section-heading text-center" style={{ maxWidth: 720 }}>
          I help teams turn uncertainty into direction.
        </h2>

        <p className="text-body text-[#565656]" style={{ maxWidth: 500 }}>
          Hi, I&apos;m Steven 👋🏼 For 10+ years, I&apos;ve worked across strategy,
          product, research, and design, helping teams figure out what matters,
          and turn that direction into something real. Now, that&apos;s Milk.
        </p>

        <a
          href="https://medium.com/@stevencooper_75268/why-design-matters-05df943703eb?sharedUserId=stevencooper_75268"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0C0C12] rounded-full px-6 py-2.5 font-sans text-[14px] font-medium text-white inline-flex items-center gap-2 hover:bg-[#2E2E2E] transition-colors tracking-[-0.28px]"
        >
          Why Design Matters?
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 13L13 3M13 3H6M13 3v7" />
          </svg>
        </a>
      </motion.div>

      {/* Image fan */}
      <motion.div
        className="relative flex w-full max-w-3xl items-center justify-center -mx-10 lg:mx-0"
        style={{ position: "relative", zIndex: 1 }}
        variants={fanContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {photos.map((photo, i) => {
          const slot = fanSlots[i];
          return (
            <motion.div
              key={photo.src}
              custom={slot}
              variants={fanCardVariants}
              className="relative shrink-0 overflow-hidden rounded-2xl shadow-xl"
              style={{
                width: `${slot.widthPct}%`,
                aspectRatio: "4/5",
                zIndex: slot.zIndex,
                marginRight: slot.mr,
                marginLeft: slot.ml,
                outline: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                decoding="async"
              />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
