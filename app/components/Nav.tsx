"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import Image from "next/image";
import ContactModal from "./ContactModal";

const links = [
  { label: "About", href: "/#about-us" },
  { label: "Why Milk?", href: "/#who-we-are" },
  { label: "Formula", href: "/#method" },
  { label: "Disciplines", href: "/#services" },
  { label: "Work", href: "/#portfolio" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/steven-cooper-brenes/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
        <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/milkdotdesign/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 448 512" fill="currentColor">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@stevencooper_75268",
    icon: (
      <svg width="16" height="16" viewBox="0 0 640 512" fill="currentColor">
        <path d="M180.5 74.3C80.8 74.3 0 155.6 0 256S80.8 437.7 180.5 437.7 361 356.4 361 256 280.2 74.3 180.5 74.3zm288.3 10.6c-49.8 0-90.2 76.6-90.2 171.1s40.4 171.1 90.2 171.1 90.3-76.6 90.3-171.1-40.5-171.1-90.3-171.1zm139.5 17.8c-17.5 0-31.7 68.6-31.7 153.3s14.2 153.3 31.7 153.3S640 340.6 640 256c0-84.9-14.2-153.3-31.7-153.3z"/>
      </svg>
    ),
  },
];

const ease = [0.22, 1, 0.36, 1] as const;


export default function Nav() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [visible, setVisible]       = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);
  const [modalService, setModalService] = useState<string | undefined>(undefined);
  const [socialOpen, setSocialOpen] = useState(false);
  const [fadeActive, setFadeActive] = useState(false);
  const [fadeDuration, setFadeDuration] = useState(2.2);
  const [pendingSection, setPendingSection] = useState<string | null>(null);
  const [showCta, setShowCta] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const shadowBlur   = useTransform(scrollY, [0, 160], [0, 24]);
  const shadowAlpha  = useTransform(scrollY, [0, 160], [0, 0.09]);
  const pillShadow   = useMotionTemplate`0 2px ${shadowBlur}px rgba(0,0,0,${shadowAlpha}), 0 1px 0 rgba(255,255,255,0.8) inset`;

  const pathname = usePathname();
  const router = useRouter();

  // Track which snap section owns the viewport center — RAF loop so it works with Lenis
  useEffect(() => {
    if (pathname !== "/") { setActiveSection(null); return; }

    const sectionIds = links
      .map(l => l.href.match(/\/#(.+)$/)?.[1])
      .filter(Boolean) as string[];

    let raf: number;
    let last: string | null = null;

    const tick = () => {
      const mid = window.innerHeight / 2;
      let found: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= mid && bottom >= mid) { found = id; break; }
      }
      if (found !== last) { last = found; setActiveSection(found); }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Hide CTA when hero section is visible on homepage
  useEffect(() => {
    if (pathname !== "/") { setShowCta(true); return; }
    const hero = document.getElementById("home");
    if (!hero) { setShowCta(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => setShowCta(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  // After navigating to "/", snap to the pending section
  useEffect(() => {
    if (pathname !== "/" || !pendingSection) return;
    const id = pendingSection;
    setPendingSection(null);
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { id } }));
    }, 350);
    return () => clearTimeout(t);
  }, [pathname, pendingSection]);

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (window.location.pathname === "/") return;
    // Pre-set flags so intro loader and page loader don't play, and Let's Talk doesn't flash
    sessionStorage.setItem("milk:intro-shown", "1");
    sessionStorage.setItem("milkLoaded", "1");
    setShowCta(false);
    // Quick white fade, then navigate
    setFadeDuration(0.55);
    setFadeActive(true);
    setTimeout(() => {
      router.push("/");
      setTimeout(() => {
        setFadeDuration(1.1);
        setFadeActive(false);
      }, 150);
    }, 550);
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string, onClose?: () => void) {
    const match = href.match(/^\/#(.+)$/);
    if (!match) return;
    e.preventDefault();
    onClose?.();
    if (window.location.pathname === "/") {
      // Already on homepage: snap directly
      window.dispatchEvent(new CustomEvent("milk:snap-to", { detail: { id: match[1] } }));
      return;
    }
    // On a case page: fade to white, skip intro loader and page loader, then navigate
    const sectionId = match[1];
    setFadeDuration(2.2);
    setFadeActive(true);
    setTimeout(() => {
      sessionStorage.setItem("milk:intro-shown", "1");
      sessionStorage.setItem("milkLoaded", "1");
      setPendingSection(sectionId);
      router.push("/");
      setTimeout(() => setFadeActive(false), 100);
    }, 2200);
  }

  useEffect(() => {
    // If navigating to "/" before the intro has played, hide the nav so it
    // doesn't bleed through from a previous page visit.
    if (pathname === "/" && !sessionStorage.getItem("milk:intro-shown")) {
      setVisible(false);
    }

    const show = () => setVisible(true);
    window.addEventListener("milk:intro-exit", show, { once: true });
    // Safety-net: show nav after 15s in case the event never fires.
    const t = setTimeout(show, 15000);
    return () => {
      window.removeEventListener("milk:intro-exit", show);
      clearTimeout(t);
    };
  }, [pathname]);

  useEffect(() => {
    const handler = (e: Event) => {
      setModalService((e as CustomEvent).detail?.service ?? undefined);
      setModalOpen(true);
    };
    window.addEventListener("milk:open-contact", handler);
    return () => window.removeEventListener("milk:open-contact", handler);
  }, []);

  return (
    <>
      {/* Floating pill nav — pointer-events:none on wrapper so clicks pass through */}
      <div
        className="fixed z-50 px-8 lg:px-0"
        style={{
          inset: "0 0 auto 0",
          display: "flex",
          justifyContent: "center",
          paddingTop: 24,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
        {visible && (
        <motion.header
          className="w-full lg:w-auto"
          style={{ pointerEvents: "auto" }}
          initial={{ opacity: 0, y: -32, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -32, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Pill */}
          <motion.div
            layout
            className="relative flex items-center gap-2.5 rounded-full w-full lg:w-auto justify-between lg:justify-start"
            style={{
              padding: "8px 8px 8px 24px",
              minHeight: 60,
              background: "rgba(250,250,250,0.88)",
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: pillShadow,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          >
            {/* Specular sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)" }}
            />
            {/* Logo */}
            <a href="/" onClick={handleLogoClick} className="shrink-0 mr-2">
              <Image
                src="/MilkLogo-Black.png"
                alt="Milk"
                width={60}
                height={16}
                priority
                style={{ width: 60, height: "auto" }}
              />
            </a>

            {/* Desktop links */}
            <nav className="hidden lg:flex items-center mx-4" style={{ gap: 28 }}>
              {links.map((link) => {
                const sectionId = link.href.match(/\/#(.+)$/)?.[1] ?? null;
                const isActive = sectionId
                  ? (activeSection === sectionId) || (sectionId === "portfolio" && pathname.startsWith("/cases/"))
                  : pathname === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-ui transition-opacity hover:opacity-70"
                    suppressHydrationWarning
                    style={{
                      color: isActive ? "#000000" : "#555",
                      fontWeight: isActive ? 500 : 400,
                      position: "relative",
                      paddingTop: 4,
                      paddingBottom: 4,
                    }}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      suppressHydrationWarning
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: isActive ? "60%" : 0,
                        height: 1.5,
                        borderRadius: 999,
                        background: "#000",
                        transition: "width 0.25s ease",
                      }}
                    />
                  </a>
                );
              })}
              {/* Social dropdown */}
              <div className="relative" onMouseEnter={() => setSocialOpen(true)} onMouseLeave={() => setSocialOpen(false)}>
                <button className="inline-flex items-center gap-1 text-ui text-[#555] hover:opacity-50 transition-opacity">
                  Social
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3.5L5 6.5L8 3.5" />
                  </svg>
                </button>
                <AnimatePresence>
                  {socialOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-3 rounded-xl overflow-hidden"
                      style={{
                        background: "rgba(250,250,250,0.96)",
                        backdropFilter: "blur(40px) saturate(160%)",
                        WebkitBackdropFilter: "blur(40px) saturate(160%)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                        minWidth: 160,
                      }}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease }}
                    >
                      {socialLinks.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 text-ui text-[#555] hover:text-[#111] hover:bg-black/[0.04] transition-colors"
                        >
                          {s.icon}
                          {s.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* CTA pill button — removed from DOM on hero so pill width shrinks */}
            <AnimatePresence>
              {showCta && (
                <motion.button
                  key="cta"
                  onClick={() => setModalOpen(true)}
                  className="hidden lg:inline-flex font-sans font-medium text-[15px] text-white tracking-[-0.45px] rounded-full shrink-0"
                  style={{
                    background: "#1a1a1a",
                    padding: "12px 20px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
                  }}
                  initial={{ opacity: 0, scale: 0.82, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.82, x: 10 }}
                  whileHover={{ opacity: 0.82 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                >
                  Let&apos;s Talk
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile burger — 3D */}
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-[5px] w-10 h-10 justify-center items-center rounded-full"
              style={{
                background: "#1a1a1a",
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              aria-label="Toggle menu"
            >
              <span className="block h-[1.5px] w-4 bg-white transition-transform duration-300"
                style={{ transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none" }} />
              <span className="block h-[1.5px] w-4 bg-white transition-opacity duration-300"
                style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="block h-[1.5px] w-4 bg-white transition-transform duration-300"
                style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
            </motion.button>
          </motion.div>
        </motion.header>
        )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-8 z-40 rounded-2xl lg:hidden overflow-hidden"
            style={{
              top: 88,
              background: "rgba(250,250,250,0.92)",
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease }}
          >
            {/* Specular sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0) 100%)" }}
            />
            <div className="flex flex-col p-6 gap-1">
              {links.map((link, i) => {
                const sectionId = link.href.match(/\/#(.+)$/)?.[1] ?? null;
                const isActive = sectionId
                  ? (activeSection === sectionId) || (sectionId === "portfolio" && pathname.startsWith("/cases/"))
                  : pathname === link.href;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="text-title py-2"
                    style={{ color: isActive ? "#111" : "#999", textDecoration: isActive ? "underline" : "none", textUnderlineOffset: "4px" }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease }}
                    onClick={(e) => { handleNavClick(e, link.href, () => setMenuOpen(false)); setMenuOpen(false); }}
                  >
                    {link.label}
                  </motion.a>
                );
              })}
              {socialLinks.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-subheading text-[#999] py-2 flex items-center gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (links.length + i) * 0.05, duration: 0.3, ease }}
                >
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  {s.label}
                </motion.a>
              ))}
              {showCta && (
                <motion.button
                  className="mt-4 inline-flex font-sans font-medium text-[15px] text-white tracking-[-0.45px] rounded-full w-fit"
                  style={{ background: "#111", padding: "12px 20px" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (links.length + socialLinks.length) * 0.05, duration: 0.3, ease }}
                  onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                >
                  Let&apos;s Talk
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ContactModal open={modalOpen} onClose={() => { setModalOpen(false); setModalService(undefined); }} initialService={modalService} />

      {/* Fade-to-white overlay for case → homepage transitions */}
      <AnimatePresence>
        {fadeActive && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-white pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: fadeDuration, ease: [0.4, 0, 0.2, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
