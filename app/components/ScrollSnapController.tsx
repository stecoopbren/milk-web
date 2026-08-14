'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function smoothScrollTo(targetY: number, onDone: () => void) {
  const lenis = (window as any).__lenis;
  const distance = Math.abs(targetY - window.scrollY);
  if (distance < 4) { onDone(); return; }

  let fired = false;
  const fireEnd = () => {
    if (fired) return;
    fired = true;
    document.body.classList.remove("is-snapping");
    window.dispatchEvent(new Event("milk:snap-end"));
    onDone();
  };

  if (lenis) {
    window.dispatchEvent(new Event("milk:snap-start"));
    document.body.classList.add("is-snapping");
    // Safety net: if onComplete never fires (e.g. native scroll interrupts Lenis
    // and its animation stalls), unblock isSnapping after duration + buffer.
    const safetyTimer = setTimeout(fireEnd, 2500);
    lenis.scrollTo(targetY, {
      duration: 1.1,
      easing: easeOutQuart,
      lock: true,
      onComplete: () => { clearTimeout(safetyTimer); fireEnd(); },
    });
  } else {
    // Fallback if Lenis isn't ready yet
    window.scrollTo({ top: targetY, behavior: "smooth" });
    setTimeout(fireEnd, 1600);
  }
}

export default function ScrollSnapController() {
  const pathname = usePathname();

  useEffect(() => {
    const snapPages = ['/', '/portfolio'];
    if (!snapPages.includes(pathname) && !pathname.startsWith('/cases/')) return;

    let isSnapping = false;
    let cooldown = false;
    let currentIndex = 0;

    const getSections = (): HTMLElement[] =>
      (Array.from(document.querySelectorAll('.snap-section')) as HTMLElement[])
        .filter((el) => getComputedStyle(el).display !== 'none');

    const getSectionTop = (el: HTMLElement): number =>
      el.getBoundingClientRect().top + window.scrollY;

    const getNearestIndex = (): number => {
      const sections = getSections();
      if (sections.length === 0) return 0;
      const scrollTop = window.scrollY;
      let closest = 0;
      let minDist = Infinity;
      sections.forEach((el, i) => {
        const dist = Math.abs(getSectionTop(el) - scrollTop);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      return closest;
    };

    const SNAP_COOLDOWN = 250;

    const snapToIndex = (index: number) => {
      const sections = getSections();
      if (sections.length === 0) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, index));

      const el = sections[clamped];
      let targetY = getSectionTop(el);

      // When navigating UP into a free-scroll section, land at the end of it
      // so the user sees the exit frame (e.g. "Now I bring it to yours")
      // rather than the entry frame.
      // Also check physical scroll position as fallback — on mobile, Lenis onComplete
      // can fire late, leaving currentIndex stale and making clamped < currentIndex false
      // even though the user is physically past the section end.
      if (el.dataset.freeScroll) {
        const sectionEnd = getSectionTop(el) + el.offsetHeight - window.innerHeight;
        const comingFromBelow = window.scrollY > sectionEnd + 10;
        if (clamped < currentIndex || comingFromBelow) {
          targetY = Math.max(targetY, sectionEnd);
        }
      }

      currentIndex = clamped;
      isSnapping = true;
      cooldown = true;
      smoothScrollTo(targetY, () => {
        isSnapping = false;
        setTimeout(() => { cooldown = false; }, SNAP_COOLDOWN);
      });
    };

    // Disable browser scroll restoration and force top on load
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    currentIndex = 0;

    // External nav can dispatch 'milk:snap-to' with { id: 'section-id' } or { index: number }
    const onSnapTo = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const sections = getSections();
      if (typeof detail?.index === 'number') {
        snapToIndex(detail.index);
        return;
      }
      const idx = sections.findIndex(el => el.id === detail?.id);
      if (idx !== -1) snapToIndex(idx);
    };
    window.addEventListener('milk:snap-to', onSnapTo);

    // ── Free-scroll detection ─────────────────────────────────────────────────
    // A free-scroll zone element straddles the viewport: its top is above/at the
    // viewport top AND its bottom is below/at the viewport bottom.
    // display:none elements return rect.bottom = 0 and correctly fail.
    const isInFreeScrollZone = (): boolean =>
      (Array.from(document.querySelectorAll('[data-free-scroll]')) as HTMLElement[])
        .some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= 10 && r.bottom >= window.innerHeight - 10;
        });

    // ── Native-scroll detection ───────────────────────────────────────────────
    // Sections with data-native-scroll have dynamic height (e.g. accordion).
    // We release wheel control entirely and let the browser scroll natively.
    // Two modes:
    //   • At section top (not yet scrolled in): only activate if section is
    //     taller than the viewport (i.e. there is content to scroll through).
    //   • Already scrolled into section: stay active until section exits the
    //     viewport entirely — prevents premature snap when the section bottom
    //     comes into view mid-scroll (e.g. after expanding a deep accordion).
    const isInNativeScrollZone = (): boolean =>
      (Array.from(document.querySelectorAll('[data-native-scroll]')) as HTMLElement[])
        .some((el) => {
          const r = el.getBoundingClientRect();
          const sectionTop = r.top + window.scrollY;
          const isTaller = el.offsetHeight > window.innerHeight + 20;
          const scrolledIn = window.scrollY > sectionTop + 5;
          if (scrolledIn) {
            // Keep native scroll active until section fully exits viewport,
            // but only for sections that are genuinely taller than the viewport.
            // Prevents Lenis overshoot from permanently releasing control on
            // sections whose content fits within the viewport.
            return isTaller && r.bottom > 0;
          }
          // At or near section top: activate only when the section is genuinely
          // taller than the viewport (has content to scroll through).
          return r.top <= 150 && isTaller;
        });

    // ── Wheel ─────────────────────────────────────────────────────────────────
    let wheelTimeout: ReturnType<typeof setTimeout>;
    let accumulatedDelta = 0;

    const stepWithinFreeZone = (direction: number) => {
      // Sync currentIndex to the active free-scroll zone before stepping.
      // This is necessary when multiple consecutive sections have data-free-scroll
      // (e.g. TickerSection → BioSection → TeamSection): without this sync,
      // currentIndex stays pinned to the first zone and exiting the last zone
      // would snap back to the wrong section.
      const sections = getSections();
      const activeZoneIdx = sections.findIndex((el) => {
        if (!el.dataset.freeScroll) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 10 && r.bottom >= window.innerHeight - 10;
      });
      if (activeZoneIdx !== -1) currentIndex = activeZoneIdx;

      isSnapping = true;
      cooldown = true;
      const targetY = Math.round(window.scrollY + direction * window.innerHeight);
      smoothScrollTo(targetY, () => {
        isSnapping = false;
        // If the step carried us out of every free-scroll zone, snap to the
        // nearest regular section immediately rather than waiting for the user
        // to scroll again (which would waste one input event).
        if (!isInFreeScrollZone()) {
          const nearest = getNearestIndex();
          const target = Math.max(currentIndex - 1, Math.min(currentIndex + 1, nearest));
          snapToIndex(target);
          return;
        }
        setTimeout(() => { cooldown = false; }, SNAP_COOLDOWN);
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const lenis = (window as any).__lenis;
      // Native-scroll zone: stop Lenis so its inertia doesn't overshoot the
      // section, then let the browser scroll natively.
      if (isInNativeScrollZone()) {
        // While a snap animation is in progress, block native scroll so it doesn't
        // fight the Lenis scrollTo and prevent its onComplete from firing (the freeze).
        if (isSnapping || cooldown) {
          e.preventDefault();
          return;
        }
        const direction = e.deltaY > 0 ? 1 : -1;
        // Upward: snap to previous section when at the section top.
        // Downward: let native scroll run freely; scrollend handles the exit snap
        // so trackpad momentum doesn't trigger it too early.
        if (direction < 0) {
          const atTop = (Array.from(document.querySelectorAll('[data-native-scroll]')) as HTMLElement[])
            .some(el => el.getBoundingClientRect().top >= -4);
          if (atTop) snapToIndex(currentIndex + direction);
        }
        // Not at top boundary (or scrolling down): allow native scroll.
        return;
      }
      // Resuming from native zone — restart Lenis before handling the event.
      lenis?.start();
      e.preventDefault();
      if (isSnapping || cooldown) return;

      accumulatedDelta += e.deltaY;

      if (Math.abs(accumulatedDelta) < 40) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => { accumulatedDelta = 0; }, 200);
        return;
      }

      const direction = accumulatedDelta > 0 ? 1 : -1;
      accumulatedDelta = 0;
      clearTimeout(wheelTimeout);

      // Inside a free-scroll zone: step one viewport at a time instead of
      // releasing to native scroll, which lets trackpad momentum race through.
      if (isInFreeScrollZone()) {
        stepWithinFreeZone(direction);
        return;
      }

      // Always move exactly one section from the last known position.
      // Do NOT call getNearestIndex() here — after a free-scroll zone the
      // user may be between sections and getNearestIndex() would return the
      // next section, causing snapToIndex(next + 1) to skip it.
      snapToIndex(currentIndex + direction);
    };

    // ── Touch ─────────────────────────────────────────────────────────────────
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isSnapping) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      const direction = delta > 0 ? 1 : -1;
      if (isInNativeScrollZone()) return;
      if (isInFreeScrollZone()) {
        stepWithinFreeZone(direction);
        return;
      }
      snapToIndex(currentIndex + direction);
    };

    // ── scrollend fallback (keyboard / scrollbar / free-scroll exit) ──────────
    const onScrollEnd = () => {
      if (isSnapping || cooldown || isInFreeScrollZone()) return;
      if (isInNativeScrollZone()) {
        const sections = getSections();
        const nativeEls = Array.from(document.querySelectorAll('[data-native-scroll]')) as HTMLElement[];

        // Forward exit: section bottom is at or past the viewport bottom — user has
        // seen all content. Snap to the next section.
        const bottomReached = nativeEls.some(el => {
          const r = el.getBoundingClientRect();
          return r.bottom <= window.innerHeight + 10 && el.offsetHeight > window.innerHeight + 20;
        });
        if (bottomReached) {
          snapToIndex(currentIndex + 1);
          return;
        }

        // Overscroll correction: momentum carried us to the top of a native-scroll
        // section, skipping a non-native section above. Snap to the first skipped one.
        const overscrolledSection = nativeEls.find(el => {
          const r = el.getBoundingClientRect();
          return r.top >= -30 && r.top <= 150 && el.offsetHeight > window.innerHeight;
        });
        if (overscrolledSection) {
          const idx = sections.findIndex(el => el === overscrolledSection);
          if (idx !== -1) {
            const target = idx > currentIndex + 1 ? currentIndex + 1 : idx;
            if (target !== currentIndex) snapToIndex(target);
          }
        }
        return;
      }
      // If we've scrolled past the midpoint of the current data-native-scroll section,
      // always advance forward — prevents snapping back to the section top on scrollend.
      const sections = getSections();
      const current = sections[currentIndex];
      if (current?.dataset.nativeScroll) {
        const sectionTop = getSectionTop(current);
        if (window.scrollY > sectionTop + current.offsetHeight * 0.5) {
          snapToIndex(currentIndex + 1);
          return;
        }
      }

      // (smoothWheel:false — Lenis was never stopped, no need to restart it here)

      const nearest = getNearestIndex();
      // Clamp to ±1 so momentum overshoot never skips a section.
      const target = Math.max(currentIndex - 1, Math.min(currentIndex + 1, nearest));
      snapToIndex(target);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('milk:snap-to', onSnapTo);
      clearTimeout(wheelTimeout);
    };
  }, [pathname]);

  return null;
}
