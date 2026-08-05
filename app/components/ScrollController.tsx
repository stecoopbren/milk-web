"use client";

import { useEffect, useRef } from "react";

export default function ScrollController() {
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const getSections = () =>
      Array.from(document.querySelectorAll(".snap-section")) as HTMLElement[];

    const getCurrentIndex = (sections: HTMLElement[]) => {
      // Find the last section whose top edge is at or above the current scroll position.
      // This correctly handles tall sticky sections (e.g. BioSection) whose center
      // would be hundreds of vh away from the viewport.
      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= window.scrollY) {
          current = i;
        }
      }
      return current;
    };

    const goTo = (index: number) => {
      const sections = getSections();
      if (index < 0 || index >= sections.length) return;
      isScrolling.current = true;
      sections[index].scrollIntoView({ behavior: "smooth" });

      // Use scrollend for accuracy; fallback to a generous timeout
      let settled = false;
      const release = () => {
        if (settled) return;
        settled = true;
        isScrolling.current = false;
        window.removeEventListener("scrollend", release);
      };
      window.addEventListener("scrollend", release, { once: true });
      setTimeout(release, 1200);
    };

    const scrollWithin = (down: boolean) => {
      isScrolling.current = true;
      window.scrollBy({ top: down ? window.innerHeight : -window.innerHeight, behavior: "smooth" });
      let settled = false;
      const release = () => {
        if (settled) return;
        settled = true;
        isScrolling.current = false;
        window.removeEventListener("scrollend", release);
      };
      window.addEventListener("scrollend", release, { once: true });
      setTimeout(release, 1200);
    };

    const handleWheel = (e: WheelEvent) => {
      // Desktop only — let CSS snap handle mobile touch
      if (window.innerWidth < 1024) return;
      // Ignore horizontal-dominant scrolls (trackpad side-swipe)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (isScrolling.current) return;
      // Ignore tiny momentum/inertia events that follow a real gesture
      if (Math.abs(e.deltaY) < 20) return;

      const sections = getSections();
      const current = getCurrentIndex(sections);
      const el = sections[current];
      const down = e.deltaY > 0;

      // If this section is taller than 1.5× the viewport, scroll within it
      // one viewport at a time before moving to the next section.
      if (el.offsetHeight > window.innerHeight * 1.5) {
        const viewportBottom = window.scrollY + window.innerHeight;
        const sectionBottom = el.offsetTop + el.offsetHeight;
        if (down && viewportBottom < sectionBottom - 50) {
          scrollWithin(true);
          return;
        }
        if (!down && window.scrollY > el.offsetTop + 50) {
          scrollWithin(false);
          return;
        }
      }

      goTo(current + (down ? 1 : -1));
    };

    // Mobile: one-section-at-a-time touch swipe
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return; // ignore small taps

      const sections = getSections();
      const current = getCurrentIndex(sections);
      const el = sections[current];
      const down = delta > 0;

      // Mirror the wheel handler: scroll within tall sections one viewport at a time
      if (el && el.offsetHeight > window.innerHeight * 1.5) {
        const viewportBottom = window.scrollY + window.innerHeight;
        const sectionBottom = el.offsetTop + el.offsetHeight;
        if (down && viewportBottom < sectionBottom - 50) {
          scrollWithin(true);
          return;
        }
        if (!down && window.scrollY > el.offsetTop + 50) {
          scrollWithin(false);
          return;
        }
      }

      goTo(current + (down ? 1 : -1));
    };

    // Fallback: if natural scrolling stops between sections, snap to the nearest one.
    // Skips tall sections (Bio) since scroll-within handles those.
    const handleScrollEnd = () => {
      if (isScrolling.current) return;
      const sections = getSections();
      const current = getCurrentIndex(sections);
      const el = sections[current];
      if (el.offsetHeight > window.innerHeight * 1.5) return;
      if (Math.abs(window.scrollY - el.offsetTop) > 5) {
        isScrolling.current = true;
        el.scrollIntoView({ behavior: "smooth" });
        let settled = false;
        const release = () => {
          if (settled) return;
          settled = true;
          isScrolling.current = false;
          window.removeEventListener("scrollend", release);
        };
        window.addEventListener("scrollend", release, { once: true });
        setTimeout(release, 1000);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("scrollend", handleScrollEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("scrollend", handleScrollEnd);
    };
  }, []);

  return null;
}
