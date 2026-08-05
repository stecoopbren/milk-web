"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

interface CursorDef {
  name: string;
  role: string;
  color: string;
  emoji: string;
  floatX: string[];
  floatY: string[];
  floatDuration: number;
  settleX: string;
  settleY: string;
  message: string;
  initialDelay: number;
}

const CURSORS: CursorDef[] = [
  { name: "Alex",   role: "Product Manager", color: "#C45E2F", emoji: "👩🏽",   settleX: "22%", settleY: "30%", floatX: ["22%","30%","25%","32%","22%"], floatY: ["30%","38%","32%","24%","30%"], floatDuration: 8, message: "any ideas? 🤔",             initialDelay: 0  },
  { name: "Mia",    role: "Designer",        color: "#2E7AAD", emoji: "👩🏼",   settleX: "58%", settleY: "22%", floatX: ["56%","64%","50%","60%","56%"], floatY: ["32%","22%","40%","28%","32%"], floatDuration: 5, message: "where do we even start?",   initialDelay: 10 },
  { name: "Carlos", role: "Developer",       color: "#B84D8A", emoji: "🧑🏻",   settleX: "60%", settleY: "56%", floatX: ["60%","52%","66%","56%","60%"], floatY: ["56%","48%","62%","52%","56%"], floatDuration: 4, message: "I have no clue...",          initialDelay: 18 },
  { name: "Sam",    role: "Strategist",      color: "#A67C00", emoji: "👨🏾",   settleX: "22%", settleY: "72%", floatX: ["24%","16%","32%","20%","24%"], floatY: ["72%","64%","78%","68%","72%"], floatDuration: 3, message: "hello?? anyone there?",      initialDelay: 25 },
  { name: "Jordan", role: "Researcher",      color: "#3D8B6E", emoji: "🧑🏽",   settleX: "78%", settleY: "38%", floatX: ["78%","70%","84%","74%","78%"], floatY: ["38%","30%","44%","34%","38%"], floatDuration: 4, message: "what's the timeline here?", initialDelay: 33 },
  { name: "Tyler",  role: "Engineer",        color: "#C4394A", emoji: "👨🏼",   settleX: "10%", settleY: "50%", floatX: ["10%","18%","6%","14%","10%"],  floatY: ["50%","42%","56%","46%","50%"], floatDuration: 6, message: "we need a design system",    initialDelay: 42 },
  { name: "Nina",   role: "Analyst",         color: "#2B6E8A", emoji: "👩🏻",   settleX: "50%", settleY: "78%", floatX: ["50%","58%","44%","54%","50%"], floatY: ["78%","70%","84%","74%","78%"], floatDuration: 4, message: "no one aligned on this",     initialDelay: 50 },
];

// Mobile: 3 cursors only, positioned in whitespace above/below the text block
const MOBILE_CURSORS: CursorDef[] = [
  { name: "Mia",  role: "Designer",   color: "#2E7AAD", emoji: "👩🏼", settleX: "14%", settleY: "14%", floatX: ["14%","20%","10%","18%","14%"], floatY: ["14%","8%","18%","11%","14%"],  floatDuration: 5, message: "where do we even start?", initialDelay: 10 },
  { name: "Sam",  role: "Strategist", color: "#A67C00", emoji: "👨🏾", settleX: "12%", settleY: "76%", floatX: ["12%","6%","18%","10%","12%"],  floatY: ["76%","70%","80%","73%","76%"], floatDuration: 3, message: "hello?? anyone there?",   initialDelay: 20 },
  { name: "Nina", role: "Analyst",    color: "#2B6E8A", emoji: "👩🏻", settleX: "16%", settleY: "86%", floatX: ["16%","10%","22%","14%","16%"], floatY: ["86%","80%","90%","84%","86%"], floatDuration: 4, message: "no one aligned on this",  initialDelay: 35 },
];

type Phase = "idle" | "floating" | "settling" | "typingIndicator" | "typing" | "holding";

function TypingDots({ color }: { color: string }) {
  return (
    <div style={{
      background: color,
      borderRadius: 999,
      padding: "9px 14px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
      opacity: 0.92,
      display: "flex",
      gap: 5,
      alignItems: "center",
    }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.9)", flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

function FloatingCursor({ def }: { def: CursorDef }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedChars, setTypedChars] = useState(0);
  const controls = useAnimation();
  const mounted = useRef(true);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => {
    mounted.current = true;

    const addTimeout = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timeoutsRef.current.push(t);
      return t;
    };

    const runCycle = async () => {
      if (!mounted.current) return;

      // ── 1. Float ─────────────────────────────────────────────────────────
      setPhase("floating");
      await controls.start({
        left: def.floatX,
        top: def.floatY,
        transition: {
          duration: def.floatDuration,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        },
      });
      if (!mounted.current) return;

      // ── 2. Settle ─────────────────────────────────────────────────────────
      setPhase("settling");
      await controls.start({
        left: def.settleX,
        top: def.settleY,
        transition: { duration: 0.6, ease },
      });
      if (!mounted.current) return;

      // ── 3. Typing indicator (bouncing dots) ───────────────────────────────
      setPhase("typingIndicator");
      await new Promise<void>(resolve => {
        addTimeout(() => { if (mounted.current) resolve(); }, 1400);
      });
      if (!mounted.current) return;

      // ── 4. Type ───────────────────────────────────────────────────────────
      setPhase("typing");
      let charCount = 0;

      const typeInterval = setInterval(() => {
        if (!mounted.current) { clearInterval(typeInterval); return; }
        charCount++;
        setTypedChars(charCount);

        if (charCount >= def.message.length) {
          clearInterval(typeInterval);
          if (!mounted.current) return;

          // ── 5. Hold briefly, go idle, then reappear after a random gap ───
          setPhase("holding");
          addTimeout(() => {
            if (!mounted.current) return;
            setTypedChars(0);
            setPhase("idle");
            const idleMs = 18000 + Math.random() * 20000;
            addTimeout(() => {
              if (!mounted.current) return;
              runCycle();
            }, idleMs);
          }, 2500);
        }
      }, 82);

      intervalsRef.current.push(typeInterval);
    };

    addTimeout(runCycle, def.initialDelay * 1000);

    return () => {
      mounted.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "idle") return null;

  const showRoleBadge  = phase === "floating" || phase === "settling";
  const showTypingDots = phase === "typingIndicator";
  const showBubble     = phase === "typing" || phase === "holding";

  return (
    <motion.div
      className="absolute"
      animate={controls}
      style={{ top: def.floatY[0], left: def.floatX[0] }}
    >
      {/* Cursor arrow */}
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2 1L2 16L5.5 12L8.5 19L10.5 18L7.5 11L13 11L2 1Z"
          fill="white"
          stroke={def.color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <AnimatePresence mode="wait">
        {showRoleBadge && (
          <motion.div
            key="role"
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.2, ease }}
            className="absolute"
            style={{ top: -2, left: 20, transformOrigin: "top left" }}
          >
            <div style={{
              background: def.color,
              borderRadius: 999,
              padding: "5px 12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              opacity: 0.92,
            }}>
              <span style={{
                color: "white",
                fontFamily: "Ambit, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}>
                {def.role}
              </span>
            </div>
          </motion.div>
        )}

        {showTypingDots && (
          <motion.div
            key="typing-dots"
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.2, ease }}
            className="absolute"
            style={{ top: -2, left: 20, transformOrigin: "top left" }}
          >
            <TypingDots color={def.color} />
          </motion.div>
        )}

        {showBubble && (
          <motion.div
            key="message"
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.24, ease }}
            className="absolute"
            style={{ top: -2, left: 20, transformOrigin: "top left" }}
          >
            <div style={{
              background: def.color,
              borderRadius: 999,
              padding: "6px 14px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              opacity: 0.92,
            }}>
              <span style={{
                color: "white",
                fontFamily: "Ambit, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}>
                {def.message.slice(0, typedChars)}
                {phase === "typing" && (
                  <span
                    className="cursor-blink"
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: "0.85em",
                      background: "rgba(255,255,255,0.8)",
                      marginLeft: 3,
                      verticalAlign: "text-bottom",
                      borderRadius: 1,
                    }}
                  />
                )}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MultiplayerCursors({ mobile = false }: { mobile?: boolean }) {
  const cursors = mobile ? MOBILE_CURSORS : CURSORS;
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {cursors.map((cursor) => (
        <FloatingCursor key={cursor.name} def={cursor} />
      ))}
    </div>
  );
}
