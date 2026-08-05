"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Initialises Lenis and runs its RAF loop.
// The instance is stored on window.__lenis so ScrollSnapController can call
// lenis.scrollTo() for smooth snap animations instead of window.scrollTo().
export default function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      // We handle all wheel/touch input in ScrollSnapController, so Lenis
      // only needs to smooth programmatic scrollTo() calls.
      smoothWheel: false,
      syncTouch: false,
    });

    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return null;
}
