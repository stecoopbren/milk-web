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
    // Use Lenis for all devices. On touch devices, touchmove preventDefault
    // (registered below) blocks native drag-scroll, so Lenis can animate without
    // momentum interference. lock:true guards against wheel events mid-animation.
    window.dispatchEvent(new Event("milk:snap-start"));
    document.body.classList.add("is-snapping");
    const safetyTimer = setTimeout(() => {
      // Lenis stalled — force scroll to target before releasing the snap lock.
      const liveLenis = (window as any).__lenis;
      if (Math.abs(window.scrollY - targetY) > 10) {
        if (liveLenis) liveLenis.stop();
        window.scrollTo({ top: targetY, behavior: "instant" });
        if (liveLenis) liveLenis.start();
      }
      fireEnd();
    }, 1500);
    lenis.scrollTo(targetY, {
      duration: 0.65,
      easing: easeOutQuart,
      lock: true,
      onComplete: () => { clearTimeout(safetyTimer); fireEnd(); },
    });
  } else {
    // Fallback (no Lenis): native smooth scroll with fixed timeout.
    window.dispatchEvent(new Event("milk:snap-start"));
    document.body.classList.add("is-snapping");
    window.scrollTo({ top: targetY, behavior: "smooth" });
    setTimeout(() => { fireEnd(); }, 750);
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

    // Block all navigation until the intro animation has finished.
    // Without this, swipes during the IntroLoader scroll the page behind
    // the overlay and reveal the wrong section when the loader dismisses.
    let ready = pathname !== '/' || !!sessionStorage.getItem('milk:intro-shown');
    const onIntroExit = () => { ready = true; };
    window.addEventListener('milk:intro-exit', onIntroExit, { once: true });

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

    const SNAP_COOLDOWN = 300;

    const snapToIndex = (index: number) => {
      // Stop native scroll momentum before Lenis animates (critical on iOS).
      window.scrollTo({ top: window.scrollY, behavior: 'instant' as ScrollBehavior });
      accumulatedDelta = 0;
      clearTimeout(wheelTimeout);
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
      lastSnapTime = Date.now();
      smoothScrollTo(targetY, () => {
        isSnapping = false;
        setTimeout(() => { cooldown = false; }, SNAP_COOLDOWN);
      });
    };

    // Disable browser scroll restoration and force top on load
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overscrollBehaviorY = 'none';
    currentIndex = 0;

    // External nav can dispatch 'milk:snap-to' with { id: 'section-id' } or { index: number }
    const onSnapTo = (e: Event) => {
      accumulatedDelta = 0;
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
    // Check via scroll position vs section bounds — NOT r.bottom, which fails for
    // short free-scroll sections like BioSection (250vh = 2.5 viewports): at the
    // 2nd page r.bottom = 0.5*vh < innerHeight-10, so the old check exited prematurely.
    const isInFreeScrollZone = (): boolean =>
      (Array.from(document.querySelectorAll('[data-free-scroll]')) as HTMLElement[])
        .some((el) => {
          const sTop = getSectionTop(el);
          const sEnd = sTop + el.offsetHeight - window.innerHeight;
          return window.scrollY >= sTop - 10 && window.scrollY <= sEnd + 10;
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
          const isTaller = el.offsetHeight > window.innerHeight;
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

    // ── Gesture-based snap lock ───────────────────────────────────────────────
    // After a snap fires, absorb all remaining wheel events until there has been
    // GESTURE_GAP ms of silence (momentum died). This prevents trackpad momentum
    // from accumulating and triggering a second unintended snap.
    // If incoming deltaY is larger than the previous event (momentum only decays),
    // it signals a new intentional gesture and unlocks immediately.
    let gestureSnapped = false;
    let lastWheelDeltaY = 0;
    let gestureGapTimer: ReturnType<typeof setTimeout>;
    const GESTURE_GAP = 380;
    const resetGestureGap = () => {
      clearTimeout(gestureGapTimer);
      gestureGapTimer = setTimeout(() => {
        gestureSnapped = false;
        lastWheelDeltaY = 0;
        accumulatedDelta = 0;
      }, GESTURE_GAP);
    };

    const stepWithinFreeZone = (direction: number) => {
      // Kill native touch momentum before Lenis takes over (critical on mobile).
      window.scrollTo({ top: window.scrollY, behavior: 'instant' as ScrollBehavior });

      // Sync currentIndex to the active free-scroll zone before stepping.
      // This is necessary when multiple consecutive sections have data-free-scroll
      // (e.g. TickerSection → BioSection → TeamSection): without this sync,
      // currentIndex stays pinned to the first zone and exiting the last zone
      // would snap back to the wrong section.
      const sections = getSections();
      const activeZoneIdx = sections.findIndex((el) => {
        if (!el.dataset.freeScroll) return false;
        const sTop = getSectionTop(el);
        const sEnd = sTop + el.offsetHeight - window.innerHeight;
        return window.scrollY >= sTop - 10 && window.scrollY <= sEnd + 10;
      });
      if (activeZoneIdx !== -1) currentIndex = activeZoneIdx;

      isSnapping = true;
      cooldown = true;
      let targetY = Math.round(window.scrollY + direction * window.innerHeight);

      // Clamp forward steps to the free-zone end to avoid overshooting past a
      // short section (e.g. BioSection = 250vh has 1.5vh of scroll room).
      // Without clamping, a full-viewport step from page 2 overshoots sEnd by
      // 0.5vh, isInFreeScrollZone() returns false, and we snap to the next
      // section prematurely — skipping the final frame of the animation.
      // Skip clamping when already at/near sEnd so the next swipe can exit.
      if (activeZoneIdx !== -1 && direction > 0) {
        const activeEl = sections[activeZoneIdx];
        const sEnd = getSectionTop(activeEl) + activeEl.offsetHeight - window.innerHeight;
        if (targetY > sEnd && window.scrollY < sEnd - 10) {
          targetY = Math.round(sEnd);
        }
      }

      smoothScrollTo(targetY, () => {
        isSnapping = false;
        // If the step carried us out of every free-scroll zone, snap to the
        // adjacent section (always ±1 — no getNearestIndex guessing which
        // can misfire and skip a section like BioSection).
        if (!isInFreeScrollZone()) {
          snapToIndex(direction > 0 ? currentIndex + 1 : currentIndex - 1);
          return;
        }
        setTimeout(() => { cooldown = false; }, SNAP_COOLDOWN);
      });
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Let all wheel events pass through natively when the cursor is over a
      // horizontal-scroll container (e.g. BlogSection card carousel). Without
      // this, mixed-direction trackpad events that have deltaY > deltaX get
      // intercepted and snap the page away while the user is scrolling sideways.
      if ((e.target as Element)?.closest('[data-horizontal-scroll]')) return;
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

      // Detect new active gesture: momentum only decays, so if deltaY is
      // meaningfully larger than the last event the user started a new swipe.
      if (gestureSnapped && Math.abs(e.deltaY) > Math.abs(lastWheelDeltaY) * 1.3 && Math.abs(e.deltaY) > 15) {
        gestureSnapped = false;
        accumulatedDelta = 0;
      }
      lastWheelDeltaY = e.deltaY;
      resetGestureGap();

      if (isSnapping) return;
      // One snap per gesture — absorb trackpad momentum until silence or new gesture
      if (gestureSnapped) return;

      accumulatedDelta += e.deltaY;

      if (Math.abs(accumulatedDelta) < 50) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => { accumulatedDelta = 0; }, 200);
        return;
      }

      const direction = accumulatedDelta > 0 ? 1 : -1;
      accumulatedDelta = 0;
      clearTimeout(wheelTimeout);

      // Lock: one snap per gesture from here on. Reset only after GESTURE_GAP silence.
      gestureSnapped = true;

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
    // Record the time of any snap so onScrollEnd won't fire a conflicting
    // re-snap while Lenis is still animating (1.1s) or the browser fires
    // a late scrollend event after the 250ms cooldown has already cleared.
    let lastSnapTime = 0;
    const SNAP_BLOCK = 1100; // longer than Lenis 0.65s + 300ms cooldown

    // Keep for backward-compat — touch path sets both
    let touchSnapTime = 0;
    const TOUCH_SNAP_BLOCK = 900; // slightly longer than mobile 0.75s fixed timeout

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      // Android Chrome starts scroll in the compositor thread as soon as
      // touchstart fires (if passive). By the time touchmove runs, it's too
      // late to call preventDefault(). We must prevent here, in touchstart,
      // with passive:false — but skip interactive elements so taps still work.
      if (isInNativeScrollZone()) return;
      if ((e.target as Element)?.closest('[data-horizontal-scroll]')) return;
      if ((e.target as Element)?.closest('button,a,input,select,textarea,[role="button"]')) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!ready || isSnapping || cooldown) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 60) return;
      const direction = delta > 0 ? 1 : -1;
      if (isInNativeScrollZone()) {
        const nativeTallEls = Array.from(document.querySelectorAll('[data-native-scroll]')) as HTMLElement[];
        if (direction < 0) {
          // Swipe up at section top → escape to previous section.
          const atTop = nativeTallEls.some(el => el.getBoundingClientRect().top >= -4);
          if (atTop) {
            touchSnapTime = Date.now();
            snapToIndex(currentIndex + direction);
          }
        } else {
          // Swipe down near section bottom → escape to next section.
          const atBottom = nativeTallEls.some(el => {
            const r = el.getBoundingClientRect();
            return el.offsetHeight > window.innerHeight + 20 && r.bottom <= window.innerHeight + 80;
          });
          if (atBottom) {
            touchSnapTime = Date.now();
            snapToIndex(currentIndex + 1);
          }
        }
        return;
      }
      if (isInFreeScrollZone()) {
        touchSnapTime = Date.now();
        stepWithinFreeZone(direction);
        return;
      }
      touchSnapTime = Date.now();
      snapToIndex(currentIndex + direction);
    };

    // ── scrollend fallback (keyboard / scrollbar / free-scroll exit) ──────────
    const onScrollEnd = () => {
      if (!ready || isSnapping || cooldown) return;
      // Block scrollend for 1.6s after any snap (wheel, touch, or external).
      // The browser fires scrollend after Lenis completes (~1.1s), which can
      // outlast the 250ms cooldown and trigger a second spurious snap.
      if (Date.now() - lastSnapTime < SNAP_BLOCK) return;
      if (Date.now() - touchSnapTime < TOUCH_SNAP_BLOCK) return;

      // Free-scroll zone handling: either we belong here, or momentum overshot us into it.
      if (isInFreeScrollZone()) {
        const sections = getSections();
        const freeZoneIdx = sections.findIndex(el => {
          if (!el.dataset.freeScroll) return false;
          const sTop = getSectionTop(el);
          const sEnd = sTop + el.offsetHeight - window.innerHeight;
          return window.scrollY >= sTop - 10 && window.scrollY <= sEnd + 10;
        });
        if (freeZoneIdx !== -1) {
          if (freeZoneIdx > currentIndex + 1) {
            // Native-scroll momentum (e.g. from PositioningSection) carried us
            // past the next expected section. Snap back to currentIndex + 1.
            snapToIndex(currentIndex + 1);
          } else if (freeZoneIdx === currentIndex + 1) {
            // Momentum from a native-scroll section carried us into the next
            // free-scroll zone without a controlled snap. Snap to the section
            // start so the user experiences it from the beginning.
            snapToIndex(freeZoneIdx);
          } else {
            currentIndex = freeZoneIdx; // sync without snapping
          }
        }
        return;
      }

      // If currentIndex already points to a free-scroll section, treat it as
      // being in the zone — prevents onScrollEnd from snapping past it when
      // isInFreeScrollZone() misses by a pixel after a Lenis snap.
      if (getSections()[currentIndex]?.dataset.freeScroll) return;
      if (isInNativeScrollZone()) {
        const sections = getSections();
        const nativeEls = Array.from(document.querySelectorAll('[data-native-scroll]')) as HTMLElement[];

        // Forward exit: section bottom is at or past the viewport bottom — user has
        // seen all content. Snap to the next section.
        const bottomReached = nativeEls.some(el => {
          const r = el.getBoundingClientRect();
          return r.bottom <= window.innerHeight + 10
            && el.offsetHeight > window.innerHeight + 20;
        });
        if (bottomReached) {
          // Guard: if already at the last section, don't snap back to its own top.
          if (currentIndex < sections.length - 1) {
            snapToIndex(currentIndex + 1);
          }
          return;
        }

        // Overscroll correction: momentum carried us to the top of a native-scroll
        // section, skipping a non-native section above. Snap to the first skipped one.
        // Only fires when the section top is at/above the viewport (r.top >= 0) to
        // prevent snapping back to the top when the user has already scrolled into it.
        const overscrolledSection = nativeEls.find(el => {
          const r = el.getBoundingClientRect();
          return r.top >= 0 && r.top <= 150 && el.offsetHeight > window.innerHeight;
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
      const sections = getSections();
      const current = sections[currentIndex];
      if (current?.dataset.nativeScroll) {
        // Only advance when the section bottom is actually near the viewport.
        // The old 50% threshold caused premature exit from tall sections (e.g. ChaptersSection).
        const r = current.getBoundingClientRect();
        if (r.bottom <= window.innerHeight + 40) {
          snapToIndex(currentIndex + 1);
        }
        // Always return — never let getNearestIndex make decisions about native-scroll sections.
        return;
      }

      // (smoothWheel:false — Lenis was never stopped, no need to restart it here)

      const nearest = getNearestIndex();
      // Clamp to ±1 so momentum overshoot never skips a section.
      const target = Math.max(currentIndex - 1, Math.min(currentIndex + 1, nearest));
      snapToIndex(target);
    };

    // ── Touch-move blocker (mobile momentum prevention) ───────────────────────
    // iOS momentum scroll fires after touchend and cannot be stopped by
    // window.scrollTo(). The only reliable fix is to prevent the native scroll
    // from ever starting — by calling e.preventDefault() on touchmove.
    // Native-scroll sections (data-native-scroll) and horizontal scroll
    // containers are exempted so the user can still drag-scroll inside them.
    const onTouchMove = (e: TouchEvent) => {
      if (isInNativeScrollZone()) return;
      if ((e.target as Element)?.closest('[data-horizontal-scroll]')) return;
      e.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });

    return () => {
      document.documentElement.style.overscrollBehaviorY = '';
      window.removeEventListener('milk:intro-exit', onIntroExit);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('milk:snap-to', onSnapTo);
      clearTimeout(wheelTimeout);
      clearTimeout(gestureGapTimer);
    };
  }, [pathname]);

  return null;
}
