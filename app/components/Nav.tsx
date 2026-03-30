"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const links = ["Home", "Portfolio", "About Us", "Contact"];
const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Delay entrance for hero stagger
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Switch to dark mode when the footer scrolls into the nav zone
  useEffect(() => {
    const footer = document.getElementById("contact");
    if (!footer) return;

    const NAV_BOTTOM = 130; // px from viewport top where nav pill ends

    const check = () => setIsDark(footer.getBoundingClientRect().top <= NAV_BOTTOM);

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Pill background — overrides the CSS class background via style prop
  const pillBg = {
    background: isDark
      ? "linear-gradient(160deg, rgba(15,15,16,0.60) 0%, rgba(15,15,16,0.40) 100%)"
      : "linear-gradient(160deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 100%)",
    transition: "background 0.5s ease",
  };

  const barColor = isDark ? "#EFEFEF" : "#2F2F2F";

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[45px] pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
      >
        {/* Mobile Nav pill */}
        <div
          className="lg:hidden pointer-events-auto w-[calc(100%-40px)] max-w-[330px] glass-border-animated rounded-2xl flex items-center justify-between px-6 py-4"
          style={pillBg}
        >
          <Logo isDark={isDark} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-[5px] w-6 h-5 justify-center items-center"
            aria-label="Toggle menu"
          >
            <span
              className="block h-[1.5px] w-5 transition-transform duration-300"
              style={{
                background: barColor,
                transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none",
                transition: `background 0.5s ease, transform 0.3s ease`,
              }}
            />
            <span
              className="block h-[1.5px] w-5"
              style={{
                background: barColor,
                opacity: menuOpen ? 0 : 1,
                transition: `background 0.5s ease, opacity 0.3s ease`,
              }}
            />
            <span
              className="block h-[1.5px] w-5 transition-transform duration-300"
              style={{
                background: barColor,
                transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none",
                transition: `background 0.5s ease, transform 0.3s ease`,
              }}
            />
          </button>
        </div>

        {/* Desktop Nav pill */}
        <div
          className="hidden lg:flex pointer-events-auto w-[1052px] glass-border-animated rounded-[32px] items-center justify-between px-11 py-4"
          style={pillBg}
        >
          <Logo isDark={isDark} />
          <div className="flex items-center">
            {links.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className={`px-4 py-3 rounded-2xl text-[14px] font-sans whitespace-nowrap ${
                  i === 0 ? "glass-border-animated font-bold underline" : "font-normal"
                }`}
                style={{
                  color: isDark
                    ? i === 0 ? "#EFEFEF" : "#D1D1D1"
                    : i === 0 ? "#2F2F2F" : "#565656",
                  transition: "color 0.5s ease",
                }}
              >
                {link.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-xl pt-32 pb-12 px-8 flex flex-col gap-6 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-[32px] font-sans font-medium tracking-[-1.5px] text-[#2F2F2F] leading-none"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease }}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Cross-fades between black and white logo
function Logo({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative shrink-0" style={{ width: 93, height: 24 }}>
      <Image
        src="/MilkLogo-Black.png"
        alt="Milk"
        width={93}
        height={24}
        priority
        style={{
          width: 93,
          height: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: isDark ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      />
      <Image
        src="/MilkLogo-White.png"
        alt="Milk"
        width={93}
        height={24}
        priority
        style={{
          width: 93,
          height: "auto",
          position: "absolute",
          top: 0,
          left: 0,
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
}
