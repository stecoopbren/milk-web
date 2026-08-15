"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValue, useMotionValueEvent } from "framer-motion";

const TYPE_TARGET = "Why Milk?";
const PAN_END = 0.65;
const OVERLAY_START = 0.65;  // starts immediately when pan ends — no dead scroll gap
const OVERLAY_END   = 0.72;  // fully white
const REVEAL1_START    = 0.72; // "Distilled it." fades in
const REVEAL1_PEAK     = 0.78; // "Distilled it." fully visible
const REVEAL1_HOLD_END = 0.87; // "Distilled it." starts fading out
const REVEAL1_EXIT     = 0.94; // "Distilled it." fully gone
const REVEAL2_START  = 0.94; // "Now I bring it to yours." fades in — starts only after Reveal1 is gone
const REVEAL2_END    = 1.00; // fully visible

const videos = [
  "/v09044g40000d0e102nog65gpr487m80.MP4",
  "/v09044g40000cpjmcavog65s1brudlgg.MP4",
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export default function TeamSection() {
  const outerRef  = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const frame1Ref = useRef<HTMLSpanElement>(null);
  const frame3Ref = useRef<HTMLDivElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // Refs for values used inside the event handler — avoids stale closures
  const translateMaxRef = useRef(0);
  const xInitialRef     = useRef(0);

  const [typedChars, setTypedChars] = useState(0);

  const x         = useMotionValue(0);
  const overlayOp = useMotionValue(0);
  const reveal1Op = useMotionValue(0);
  const reveal1Y  = useMotionValue(28);
  const reveal2Op = useMotionValue(0);
  const reveal2Y  = useMotionValue(28);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    // React sets autoPlay via JS after parse — mobile browsers may not honour it.
    // Explicitly play both videos so they're running before the filmstrip pans.
    video1Ref.current?.play().catch(() => {});
    video2Ref.current?.play().catch(() => {});
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !frame1Ref.current || !frame3Ref.current) return;

      const vw        = window.innerWidth;
      const paddingPx = vw * 0.1;
      const frame1W   = frame1Ref.current.offsetWidth;

      const xInit = Math.max(0, vw - 2 * paddingPx - frame1W);
      xInitialRef.current = xInit;

      // Zero the track transform so getBoundingClientRect gives us the exact
      // un-translated position of frame3. Reading a layout property immediately
      // after a style write forces a synchronous reflow — no guessing.
      trackRef.current.style.transform = "translateX(0px)";
      const frame3Right = frame3Ref.current.getBoundingClientRect().right;

      // Pan stops when frame3's right edge lands at 92vw
      const max = Math.max(0, frame3Right - vw * 0.92);
      translateMaxRef.current = max;

      const v = scrollYProgress.get();
      x.set(lerp(xInit, -max, Math.min(v / PAN_END, 1)));
    };

    // Wait for fonts, then defer one rAF so Framer Motion's transform is committed to DOM
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        measure();
        window.addEventListener("resize", measure);
      });
    });

    return () => window.removeEventListener("resize", measure);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Typewriter
    setTypedChars(Math.floor(Math.min(1, v / 0.10) * TYPE_TARGET.length));

    // Pan from initial offset → fully panned
    const max = translateMaxRef.current;
    if (max > 0) {
      x.set(lerp(xInitialRef.current, -max, Math.min(v / PAN_END, 1)));
    }

    // Overlay
    overlayOp.set(lerp(0, 1, (v - OVERLAY_START) / (OVERLAY_END - OVERLAY_START)));

    // "Distilled it." — fade in, hold, fade out
    if (v < REVEAL1_PEAK) {
      const t = (v - REVEAL1_START) / (REVEAL1_PEAK - REVEAL1_START);
      reveal1Op.set(lerp(0, 1, t));
      reveal1Y.set(lerp(28, 0, t));
    } else if (v < REVEAL1_HOLD_END) {
      reveal1Op.set(1);
      reveal1Y.set(0);
    } else {
      const t = (v - REVEAL1_HOLD_END) / (REVEAL1_EXIT - REVEAL1_HOLD_END);
      reveal1Op.set(lerp(1, 0, t));
      reveal1Y.set(lerp(0, -28, t));
    }

    // "Now I bring it to yours." — fade in
    const t2 = (v - REVEAL2_START) / (REVEAL2_END - REVEAL2_START);
    reveal2Op.set(lerp(0, 1, t2));
    reveal2Y.set(lerp(28, 0, t2));
  });

  return (
    <div
      id="who-we-are"
      ref={outerRef}
      className="snap-section relative"
      data-free-scroll="true"
      style={{ height: "900vh", scrollSnapAlign: "none" }}
    >
      <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>

        {/* Horizontal track */}
        <motion.div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center"
          style={{ x, gap: "10vw", paddingLeft: "10vw" }}
        >
          {/* Frame 1 — "You might be wondering" + typewriter "Why Milk?" as one line */}
          <div className="shrink-0 whitespace-nowrap">
            <h2 className="text-heading leading-[0.95]" style={{ fontFamily: "Ambit" }}>
              <span ref={frame1Ref}>You might be wondering... </span>
              <span>
                {TYPE_TARGET.slice(0, typedChars)}
                {typedChars < TYPE_TARGET.length && (
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
                  >|</motion.span>
                )}
              </span>
            </h2>
          </div>

          {/* Video 1 */}
          <div className="shrink-0 rounded-2xl overflow-hidden" style={{ height: "72vh", aspectRatio: "9/16" }}>
            <video ref={video1Ref} src={videos[0]} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          </div>

          {/* Frame 2 */}
          <div className="shrink-0 whitespace-nowrap text-center">
            <h2 className="text-heading leading-[0.95]" style={{ fontFamily: "Ambit" }}>
              Been inside great teams.
            </h2>
          </div>

          {/* Video 2 */}
          <div className="shrink-0 rounded-2xl overflow-hidden" style={{ height: "72vh", aspectRatio: "9/16" }}>
            <video ref={video2Ref} src={videos[1]} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          </div>

          {/* Frame 3 */}
          <div ref={frame3Ref} className="shrink-0 whitespace-nowrap" style={{ paddingRight: "440px" }}>
            <h2 className="text-heading leading-[0.95]" style={{ fontFamily: "Ambit" }}>
              Seen what works and what doesn't.
            </h2>
          </div>
        </motion.div>

        {/* White overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: overlayOp, background: "#FFFFFF", zIndex: 10 }}
        />


        {/* Reveal texts — same center position, sequential */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: reveal1Op, y: reveal1Y }}
          >
            <h2 className="text-heading text-center px-8 lg:px-[180px]">
              Distilled it.
            </h2>
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ opacity: reveal2Op, y: reveal2Y }}
          >
            <h2 className="text-heading text-center px-8 lg:px-[180px]">
              Now I bring it to yours.
            </h2>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
