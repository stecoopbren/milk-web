"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { RevealLine, BlurReveal } from "./animations";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;

const navLinks = ["Home", "Our Portfolio", "About Us", "Contact"];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <SectionReveal id="contact" className="bg-[#1F1F20] px-8 lg:px-[180px] py-20" dark>
      <div ref={ref} className="flex flex-col gap-8 w-full max-w-[1062px] mx-auto">

        {/* Main row: Logo+Nav LEFT — CTA RIGHT */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-0">

          {/* Left — Logo + Nav */}
          <motion.div
            className="flex flex-col gap-11 items-start"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
          >
            <Image
              src="/MilkLogo-White.png"
              alt="Milk"
              width={93}
              height={24}
              style={{ width: 93, height: "auto" }}
            />
            <nav className="flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`font-sans font-medium text-[20px] tracking-[-1px] leading-none transition-opacity hover:opacity-70 ${
                    i === 0 ? "text-[#EFEFEF]" : "text-[#D1D1D1]"
                  }`}
                >
                  {link}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Right — CTA */}
          <motion.div
            className="flex flex-col gap-6 w-full lg:w-[341px]"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <RevealLine
                  className="font-mono text-[#EFEFEF] text-[16px] tracking-[-0.48px] leading-6"
                  delay={0.1}
                  inView={inView}
                >
                  Let&apos;s get in touch
                </RevealLine>
                <h2 className="font-sans font-medium text-[#EFEFEF] text-[24px] tracking-[-1.2px] leading-none">
                  <RevealLine delay={0.22} inView={inView}>
                    Ready to get started? Say hi 👋
                  </RevealLine>
                </h2>
              </div>
              <BlurReveal
                text="There's someone in the world making decisions while you hesitate."
                className="font-sans text-[#D1D1D1] text-[16px] tracking-[-0.32px] leading-[1.2]"
                delay={0.4}
              />
            </div>
            <motion.a
              href="#"
              className="flex items-center justify-center gap-1 bg-white rounded-lg px-4 py-4 text-[16px] font-sans font-medium text-black tracking-[-0.96px] w-full"
              style={{ boxShadow: "0px 11px 40px 0px rgba(118,118,118,0.35)" }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25, ease }}
            >
              Let&apos;s Book a Call
              <span className="ml-1 text-[18px] leading-none">+</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#3A3A3B]" />

        {/* Copyright */}
        <motion.p
          className="font-mono text-[#D0D1D7] text-[12px] tracking-[-0.48px] leading-[1.62] text-center uppercase"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
        >
          Proudly Latinos | IN DESIGN WE TRUST /
          <br />
          Crafted with ❤️ in beautiful Costa Rica 🇨🇷 / Copyright © 2026 Milk Design Studio
        </motion.p>

        {/* Social */}
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
        >
          <p className="font-mono text-[#EFEFEF] text-[16px] tracking-[-0.48px] leading-6">
            Follow Our Journey
          </p>
          <a href="#" aria-label="Instagram" className="text-[#EFEFEF] hover:opacity-70 transition-opacity">
            <IconInstagram />
          </a>
          <a href="#" aria-label="Email" className="text-[#EFEFEF] hover:opacity-70 transition-opacity">
            <IconEmail />
          </a>
        </motion.div>

      </div>
    </SectionReveal>
  );
}

function IconInstagram() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}
