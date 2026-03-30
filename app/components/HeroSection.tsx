"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { RevealLine, BlurReveal } from "./animations";
import SectionReveal from "./SectionReveal";

const ease = [0.22, 1, 0.36, 1] as const;
const cyclingWords = ["businesses.", "communities.", "products.", "experiences.", "teams."];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = cyclingWords[textIndex];

    const typeInterval = setInterval(() => {
      if (isDeleting) {
        setDisplayText((prev) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayText((prev) => fullText.substring(0, prev.length + 1));
      }
    }, isDeleting ? 75 : 150);

    let deleteTimeout: ReturnType<typeof setTimeout> | null = null;
    if (!isDeleting && displayText === fullText) {
      deleteTimeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % cyclingWords.length);
    }

    return () => {
      clearInterval(typeInterval);
      if (deleteTimeout) clearTimeout(deleteTimeout);
    };
  }, [displayText, isDeleting, textIndex]);

  return (
    <SectionReveal
      id="home"
      className="px-8 lg:px-[180px]"
      style={{ background: "linear-gradient(to bottom, rgba(224,224,224,0.2), rgba(0,0,0,0))" }}
    >
      <div ref={ref} className="flex flex-col items-center text-center gap-6 max-w-[602px]">

        <RevealLine className="font-mono text-[16px] text-[#2F2F2F] tracking-[-0.48px] leading-6" delay={0.2} inView={inView}>
          Hey, we are milk 👋🏼
        </RevealLine>

        <h1
          className="font-sans font-medium text-[#2F2F2F] tracking-[-3.36px] leading-[0.85] w-full"
          style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
        >
          <RevealLine className="block" delay={0.35} inView={inView}>
            We turn big ideas
          </RevealLine>
          <RevealLine className="block" delay={0.45} inView={inView}>
            into thriving
          </RevealLine>
          <RevealLine className="block text-center" delay={0.55} inView={inView}>
            <span className="inline-block min-w-[2ch]">
              {displayText}
              <span className="animate-pulse opacity-60">|</span>
            </span>
          </RevealLine>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.85 }}
        >
          <BlurReveal
            text="Our proven approach has been crafted to reduce risks and maximize your success with confidence while reducing wasted efforts."
            className="font-sans font-normal text-[#565656] text-[16px] tracking-[-0.32px] leading-[1.2]"
            delay={0.85}
          />
        </motion.div>

        <motion.a
          href="#portfolio"
          className="glass-border-animated rounded-lg px-11 py-4 text-[16px] font-sans font-medium text-black tracking-[-0.96px] whitespace-nowrap cursor-pointer"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 1.0 }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          Check our Work
        </motion.a>
      </div>
    </SectionReveal>
  );
}
