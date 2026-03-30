"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const links = ["Home", "Portfolio", "About Us", "Contact"];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay nav entrance for hero stagger
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[45px] pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Mobile Nav */}
        <div className="lg:hidden pointer-events-auto w-[calc(100%-40px)] max-w-[330px] glass-border-animated rounded-2xl flex items-center justify-between px-6 py-4">
          <Logo />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-[5px] w-6 h-5 justify-center items-center"
            aria-label="Toggle menu"
          >
            <span
              className="block h-[1.5px] w-5 bg-[#2F2F2F] transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none" }}
            />
            <span
              className="block h-[1.5px] w-5 bg-[#2F2F2F] transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-[1.5px] w-5 bg-[#2F2F2F] transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }}
            />
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex pointer-events-auto w-[1052px] glass-border-animated rounded-[32px] items-center justify-between px-11 py-4">
          <Logo />
          {/* Links sit directly in the nav pill — no inner container */}
          <div className="flex items-center">
            {links.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className={`px-4 py-3 rounded-2xl text-[14px] font-sans whitespace-nowrap transition-all duration-200 ${
                  i === 0
                    ? "glass-border-animated font-bold text-[#2F2F2F] underline"
                    : "text-[#565656] font-normal hover:text-[#2F2F2F]"
                }`}
              >
                {link.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-xl pt-32 pb-12 px-8 flex flex-col gap-6 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-[32px] font-sans font-medium tracking-[-1.5px] text-[#2F2F2F] leading-none"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

function Logo() {
  return (
    <Image src="/MilkLogo-Black.png" alt="Milk" width={93} height={24} priority style={{ width: 93, height: "auto" }} />
  );
}
