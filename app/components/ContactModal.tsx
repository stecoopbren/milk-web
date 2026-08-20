"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Data ──────────────────────────────────────────────────────────────────────

const reasons = [
  { id: "project",       emoji: "🚀", title: "New Project",       subtitle: "I have something worth building" },
  { id: "hiring",        emoji: "🎯", title: "Hiring",            subtitle: "I want you on my team" },
  { id: "collaboration", emoji: "🤝", title: "Collaboration",     subtitle: "Let's create together" },
  { id: "speaking",      emoji: "🎤", title: "Speaking / Event",  subtitle: "I'd love you at our event" },
  { id: "mentorship",    emoji: "🌱", title: "Mentorship",        subtitle: "I need a thinking partner" },
  { id: "connecting",    emoji: "💬", title: "Just Connecting",   subtitle: "No agenda, just saying hi" },
];

type ContextQuestion = { id: string; label: string; options: string[]; multi?: boolean; max?: number; allowOther?: boolean };

const contextQuestions: Record<string, ContextQuestion[]> = {
  project: [
    { id: "type",     label: "Type of work",   options: ["Product Design", "Branding", "Strategy", "Design Systems", "AI / Tech", "Other"] },
    { id: "timeline", label: "Timeline",        options: ["ASAP", "1–3 months", "3–6 months", "Flexible"] },
    { id: "budget",   label: "Budget range",   options: ["Under $10k", "$10k–$25k", "$25k–$50k", "$50k+", "Not sure yet"] },
  ],
  hiring: [
    { id: "type",  label: "Opportunity type", options: ["Full-time", "Contract", "Advisory", "Fractional"] },
    { id: "stage", label: "Company stage",    options: ["Early startup", "Series A–B", "Growth stage", "Enterprise"] },
  ],
  collaboration: [
    { id: "type", label: "Type of collaboration", options: ["Co-design", "Subcontracting", "Agency partnership", "Other"] },
  ],
  speaking: [
    { id: "type",     label: "Event type",    options: ["Conference", "Workshop", "Podcast", "Panel", "Internal team"] },
    { id: "audience", label: "Audience size", options: ["Under 50", "50–200", "200+", "Online / Virtual"] },
  ],
  mentorship: [
    { id: "stage", label: "Your role",    options: ["Product designer", "Startup founder", "Early PM", "Product lead", "Other"], allowOther: true },
    { id: "focus", label: "Focus area",   options: ["Turning ideas into scalable products", "MVP definition", "Feature prioritization", "Designing systems instead of screens", "Product architecture thinking", "Information architecture", "Workflows & operational logic", "Complexity reduction", "Designing for multiple stakeholders", "Translating business chaos into product structure"], multi: true, max: 3 },
  ],
  connecting: [],
};

const leftPanelCopy: Record<string, { title: string; description: string }> = {
  reason:  { title: "What brings\nyou here?",        description: "No wrong answers. Pick whatever fits best." },
  context: { title: "A bit more\ncontext",            description: "Two quick things so Steven can come prepared." },
  chat:    { title: "Let's dig in",                   description: "A short conversation to understand what you need." },
  details: { title: "How to reach\nyou back",         description: "Steven replies personally, usually within 48h." },
  done:    { title: "You're all\nset ✓",              description: "Steven has your message and will be in touch soon." },
};

const fallbackChips: Record<string, string[][]> = {
  project:       [["Biggest risk is scope", "Finding product-market fit", "Defining the MVP"], ["Happy to share a brief", "Timeline is tight", "Can we jump on a call?"]],
  hiring:        [["Product direction and roadmap", "Design org and culture", "Fundraising narrative"], ["Happy to share the deck", "Can we jump on a call?", "Equity and retainer"]],
  collaboration: [["A client project coming up", "Ongoing design support", "A pitch we're building"], ["Short-term, a few months", "Could be recurring", "Happy to share the brief"]],
  speaking:      [["AI and building products", "Design leadership", "Strategy and product thinking"], ["A few hundred people", "Smaller focused group", "Online, global audience"]],
  mentorship:    [["What to build next", "How to lead my team", "Making a career change"], ["Just a few sessions", "Ongoing support", "One focused conversation"]],
  connecting:    [["Your work caught my eye", "Mutual connection suggested you", "Been following your work"], ["Quick question to share", "No agenda, just hi", "Exploring a potential fit"]],
};

const contextStepTitle: Record<string, string> = {
  project:       "About your project",
  hiring:        "About the opportunity",
  collaboration: "About the collaboration",
  speaking:      "About your event",
  mentorship:    "About the mentorship",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "reason" | "context" | "chat" | "details" | "done";
type Message = { role: "user" | "assistant"; content: string; done?: boolean };

// Maps service accordion names → project type option in contextQuestions
const serviceToProjectType: Record<string, string> = {
  "Design Ops":            "Strategy",
  "Business Model Design": "Strategy",
  "Service Design":        "Product Design",
  "Process Design":        "Strategy",
  "Research Strategy":     "Strategy",
  "Product Design":        "Product Design",
  "Design Systems":        "Design Systems",
  "AI Enablement":         "AI / Tech",
  "Branding":              "Branding",
};

interface Props {
  open: boolean;
  onClose: () => void;
  initialService?: string;
}

// ── Sound ─────────────────────────────────────────────────────────────────────

function playOropendula() {
  try {
    const ctx = new AudioContext();
    // Descending liquid notes mimicking the oropendula's bubbly call
    const freqs = [1100, 860, 680, 530, 400, 310];
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      // Subtle tremolo per note
      const lfo     = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value  = 14;
      lfoGain.gain.value   = 18;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(ctx.destination);

      const t = ctx.currentTime + i * 0.075;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 1.08, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.82, t + 0.065);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);

      lfo.start(t);
      osc.start(t);
      osc.stop(t + 0.065);
      lfo.stop(t + 0.065);
    });
  } catch (_) { /* AudioContext unavailable */ }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

// ── Country codes ─────────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { code: "CR", dial: "+506", name: "Costa Rica" },
  { code: "US", dial: "+1",   name: "United States" },
  { code: "GB", dial: "+44",  name: "United Kingdom" },
  { code: "CA", dial: "+1",   name: "Canada" },
  { code: "AU", dial: "+61",  name: "Australia" },
  { code: "MX", dial: "+52",  name: "Mexico" },
  { code: "ES", dial: "+34",  name: "Spain" },
  { code: "DE", dial: "+49",  name: "Germany" },
  { code: "FR", dial: "+33",  name: "France" },
  { code: "IT", dial: "+39",  name: "Italy" },
  { code: "PT", dial: "+351", name: "Portugal" },
  { code: "NL", dial: "+31",  name: "Netherlands" },
  { code: "BR", dial: "+55",  name: "Brazil" },
  { code: "AR", dial: "+54",  name: "Argentina" },
  { code: "CO", dial: "+57",  name: "Colombia" },
  { code: "CL", dial: "+56",  name: "Chile" },
  { code: "PE", dial: "+51",  name: "Peru" },
  { code: "JP", dial: "+81",  name: "Japan" },
  { code: "KR", dial: "+82",  name: "South Korea" },
  { code: "IN", dial: "+91",  name: "India" },
  { code: "SG", dial: "+65",  name: "Singapore" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "ZA", dial: "+27",  name: "South Africa" },
];

// ── Email validation ──────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactModal({ open, onClose, initialService }: Props) {
  const [step, setStep]                     = useState<Step>("reason");
  const [dir, setDir]                       = useState(1);
  const [selectedReason, setSelectedReason] = useState("");
  const [answers, setAnswers]               = useState<Record<string, string | string[]>>({});
  const [otherText, setOtherText]           = useState("");
  const [messages, setMessages]             = useState<Message[]>([]);
  const [input, setInput]                   = useState("");
  const [streaming, setStreaming]           = useState(false);
  const [chatDone, setChatDone]             = useState(false);
  const [chips, setChips]                   = useState<string[]>([]);
  const [revealed, setRevealed]             = useState<Record<number, number>>({});
  const [details, setDetails]               = useState({ name: "", email: "", company: "", phone: "", countryCode: "+506" });
  const [emailError, setEmailError]         = useState("");
  const [honeypot, setHoneypot]             = useState("");
  const [sending, setSending]               = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const reason = reasons.find(r => r.id === selectedReason);
  const aiTurnCount = messages.filter(m => m.role === "assistant" && m.done).length;
  const visibleChips = chips.length > 0
    ? chips
    : (fallbackChips[selectedReason]?.[aiTurnCount] ?? fallbackChips[selectedReason]?.[0] ?? []);
  const questions = contextQuestions[selectedReason] ?? [];
  const hasContext = questions.length > 0;
  const canAdvance = questions.every(q => {
    const a = answers[q.id];
    if (q.multi) return Array.isArray(a) && a.length > 0;
    if (q.allowOther && a === "Other") return otherText.trim().length > 0;
    return !!a;
  });

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("reason"); setSelectedReason(""); setAnswers({}); setOtherText("");
        setMessages([]); setInput(""); setChatDone(false); setChips([]); setRevealed({});
        setDetails({ name: "", email: "", company: "", phone: "", countryCode: "+506" });
        setEmailError(""); setHoneypot("");
      }, 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Pre-fill context when opened from a service button
  useEffect(() => {
    if (!open || !initialService) return;
    const projectType = serviceToProjectType[initialService];
    setSelectedReason("project");
    setAnswers(projectType ? { type: projectType } : {});
    setStep("chat");
    setDir(1);
  }, [open, initialService]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, revealed]);

  // Progressively reveal assistant sentences one at a time
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    messages.forEach((msg, i) => {
      if (msg.role !== "assistant" || !msg.done || i in revealed) return;
      const sentences = splitSentences(msg.content);
      let cumDelay = 0;
      sentences.forEach((sentence, si) => {
        // Delay scales with sentence length — feels like someone actually typing
        cumDelay += 500 + Math.min(sentence.length * 10, 900);
        timers.push(setTimeout(() => {
          setRevealed(prev => ({ ...prev, [i]: si + 1 }));
          if (si === sentences.length - 1) playOropendula();
        }, cumDelay));
      });
    });
    return () => timers.forEach(clearTimeout);
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navigation ──────────────────────────────────────────────────────────────

  const goTo = (next: Step, direction = 1) => {
    // Leaving chat — reset conversation so it restarts fresh if they return
    if (step === "chat" && next !== "chat") {
      setMessages([]); setRevealed({}); setChatDone(false); setChips([]);
    }
    setDir(direction);
    setStep(next);
  };

  // ── AI streaming ────────────────────────────────────────────────────────────

  const serializedAnswers = useCallback(() => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(answers)) {
      if (Array.isArray(v)) out[k] = v.join(", ");
      else if (v === "Other" && otherText.trim()) out[k] = otherText.trim();
      else out[k] = v;
    }
    return out;
  }, [answers, otherText]);

  const stream = useCallback(async (
    apiMessages: Message[],
    prevMessages: Message[],
    isInitial: boolean,
  ) => {
    setStreaming(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          reason: reason?.title,
          context: serializedAnswers(),
          isInitial,
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      setMessages([...prevMessages, { role: "assistant", content: "", done: false }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const ready = full.includes("✓ READY_TO_SEND");
        const chipsMatch = full.match(/\[CHIPS:\s*"([^"]+)"\s*\|\s*"([^"]+)"\s*\|\s*"([^"]+)"\]/);
        const display = full
          .replace("✓ READY_TO_SEND", "")
          .replace(/\[CHIPS:[^\]]*\]/, "")
          .trim();
        if (chipsMatch) setChips([chipsMatch[1], chipsMatch[2], chipsMatch[3]]);
        if (ready) {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: display, done: true };
            return updated;
          });
          playOropendula();
          setChatDone(true);
          setChips([]);
          break;
        }
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: display, done: false };
          return updated;
        });
      }

      // Stream ended without READY_TO_SEND — reveal whatever arrived
      if (full && !full.includes("✓ READY_TO_SEND")) {
        const display = full.replace(/\[CHIPS:[^\]]*\]/, "").trim();
        // Hard limit: if this is the 2nd+ AI message, force end
        const aiTurns = prevMessages.filter(m => m.role === "assistant").length + 1;
        const forceEnd = aiTurns >= 2;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: display, done: true };
          return updated;
        });
        playOropendula();
        if (forceEnd) { setChatDone(true); setChips([]); }
      }
    } catch (err) {
      console.error("Chat stream failed:", err);
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length && updated[updated.length - 1].role === "assistant") {
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Sorry, something went wrong on my end. Give it a moment and try again.",
            done: true,
          };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }, [reason, answers]);

  // Start AI conversation on entering chat step
  useEffect(() => {
    if (step !== "chat" || messages.length > 0) return;
    stream([], [], true);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    setChips([]);
    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    await stream(updated, updated, false);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (honeypot) return; // bot trap
    if (!isValidEmail(details.email)) { setEmailError("Please enter a valid email address."); return; }
    setSending(true);
    const phone = details.phone ? `${details.countryCode} ${details.phone}` : "";
    await fetch("/api/contact/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason?.title, context: serializedAnswers(), conversation: messages, details: { ...details, phone } }),
    });
    setSending(false);
    goTo("done");
  };

  // ── Shared button styles ─────────────────────────────────────────────────────

  const primaryBtn = "font-sans font-medium text-[15px] text-white tracking-[-0.45px] rounded-full transition-opacity disabled:opacity-30 hover:opacity-80";
  const backBtn    = "font-sans text-[14px] text-[#888] tracking-[-0.3px] hover:text-[#111] transition-colors";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 lg:p-8 pointer-events-none"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.35, ease }}
          >
            <div
              className="relative w-full max-w-[680px] flex flex-col rounded-[28px] overflow-hidden shadow-2xl pointer-events-auto"
              style={{ height: "min(680px, 88vh)", background: "#FFFFFF" }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Progress bar ──────────────────────────────────────────── */}
              {step !== "done" && (
                <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#111" }}
                    initial={false}
                    animate={{ width: `${{ reason: 25, context: 50, chat: 75, details: 100 }[step] ?? 100}%` }}
                    transition={{ duration: 0.5, ease }}
                  />
                </div>
              )}

              {/* ── Header ────────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-10 pt-10 pb-0 shrink-0">
                <Image src="/MilkLogo-Black.png" alt="Milk" width={52} height={14} style={{ width: 52, height: "auto" }} />
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/8 transition-colors"
                  style={{ background: "rgba(0,0,0,0.06)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M1 1l9 9M10 1L1 10" />
                  </svg>
                </button>
              </div>

              {/* ── Content ───────────────────────────────────────────────── */}
              <div className="flex-1 flex flex-col px-10 pb-10 overflow-hidden min-h-0">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={step}
                    className="flex-1 flex flex-col min-h-0"
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -20 }}
                    transition={{ duration: 0.28, ease }}
                  >
                    {/* Step headline */}
                    {step !== "done" && (
                      <div className="pt-5 pb-4 shrink-0">
                        <h2 className="font-sans font-medium text-[#111] text-[24px] tracking-[-1.2px] leading-[1.1]">
                          {step === "context" && contextStepTitle[selectedReason]
                            ? contextStepTitle[selectedReason]
                            : leftPanelCopy[step].title.replace("\n", " ")}
                        </h2>
                        <p className="font-sans text-[13px] leading-[1.55] tracking-[-0.2px] mt-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>
                          {leftPanelCopy[step].description}
                        </p>
                      </div>
                    )}

                      {/* ── Step 1: Reason ── */}
                      {step === "reason" && (
                        <div className="flex flex-col gap-5 flex-1">
                          <div className="grid grid-cols-2 gap-2.5 flex-1">
                            {reasons.map(r => {
                              const selected = selectedReason === r.id;
                              return (
                                <motion.button
                                  key={r.id}
                                  onClick={() => { setSelectedReason(r.id); setAnswers({}); setOtherText(""); }}
                                  className="text-left p-4 rounded-2xl transition-all"
                                  style={{
                                    background: "white",
                                    boxShadow: selected
                                      ? "0 0 0 2px #111"
                                      : "0 1px 4px rgba(0,0,0,0.07)",
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <span className="text-[20px] block mb-1.5">{r.emoji}</span>
                                  <span className="font-sans font-medium text-[13.5px] text-[#111] tracking-[-0.35px] block">{r.title}</span>
                                  <span className="font-sans text-[12px] text-[#999] tracking-[-0.2px] leading-[1.35] block mt-0.5">{r.subtitle}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => goTo(hasContext ? "context" : "chat")}
                              disabled={!selectedReason}
                              className={primaryBtn}
                              style={{ background: "#111", padding: "12px 24px" }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Step 2: Context ── */}
                      {step === "context" && (
                        <div className="flex flex-col gap-5 flex-1">
                          <div className="flex flex-col gap-5 flex-1">
                            {questions.map(q => {
                              const val = answers[q.id];
                              const selected = Array.isArray(val) ? val : (val ? [val] : []);
                              const atMax = q.multi && q.max !== undefined && selected.length >= q.max;

                              const toggle = (opt: string) => {
                                if (q.multi) {
                                  const cur = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                                  const next = cur.includes(opt)
                                    ? cur.filter(o => o !== opt)
                                    : atMax ? cur : [...cur, opt];
                                  setAnswers(prev => ({ ...prev, [q.id]: next }));
                                } else {
                                  setAnswers(prev => ({ ...prev, [q.id]: opt }));
                                  if (opt !== "Other") setOtherText("");
                                }
                              };

                              return (
                                <div key={q.id} className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <label className="font-sans font-medium text-[11px] text-[#888] tracking-[0.5px] uppercase">{q.label}</label>
                                    {q.multi && q.max && (
                                      <span className="font-sans text-[11px] text-[#bbb] tracking-[0.3px]">
                                        {selected.length}/{q.max}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {q.options.map(opt => {
                                      const active = selected.includes(opt);
                                      const disabled = !active && atMax;
                                      return (
                                        <button
                                          key={opt}
                                          onClick={() => toggle(opt)}
                                          disabled={disabled}
                                          className="font-sans text-[13px] tracking-[-0.3px] rounded-full px-3.5 py-1.5 border transition-all disabled:opacity-30"
                                          style={{
                                            borderColor: active ? "#111" : "#E2E2E2",
                                            background:  active ? "#111" : "white",
                                            color:       active ? "white" : "#333",
                                          }}
                                        >
                                          {opt}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {q.allowOther && answers[q.id] === "Other" && (
                                    <input
                                      value={otherText}
                                      onChange={e => setOtherText(e.target.value)}
                                      placeholder="Tell me more…"
                                      className="font-sans text-[14px] tracking-[-0.2px] rounded-xl px-4 py-2.5 border bg-white outline-none transition-colors"
                                      style={{ borderColor: "#E2E2E2" }}
                                      onFocus={e => (e.target.style.borderColor = "#111")}
                                      onBlur={e => (e.target.style.borderColor = "#E2E2E2")}
                                      autoFocus
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between pt-1">
                            <button onClick={() => goTo("reason", -1)} className={backBtn}>Back</button>
                            <button
                              onClick={() => goTo("chat")}
                              disabled={!canAdvance}
                              className={primaryBtn}
                              style={{ background: "#111", padding: "12px 24px" }}
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Step 3: AI Chat ── */}
                      {step === "chat" && (
                        <div className="flex flex-col gap-3 flex-1 min-h-0">
                          {/* Messages */}
                          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1" style={{ minHeight: 0 }}>
                            {messages.map((msg, i) => {
                              if (msg.role === "user") {
                                return (
                                  <motion.div
                                    key={i}
                                    className="flex justify-end"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, ease }}
                                  >
                                    <div
                                      className="font-sans text-[14px] leading-[1.6] tracking-[-0.2px] rounded-2xl px-4 py-3"
                                      style={{ maxWidth: "84%", background: "#111", color: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
                                    >
                                      {msg.content}
                                    </div>
                                  </motion.div>
                                );
                              }
                              // Assistant: ●●● while streaming; progressive sentence reveal when done
                              const sentences   = msg.done ? splitSentences(msg.content) : [];
                              const numRevealed = revealed[i] ?? 0;
                              const isTyping    = !msg.done || numRevealed < sentences.length;
                              const bubbleStyle = { maxWidth: "84%", background: "white", color: "#1A1A1A", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" };

                              return [
                                // Revealed sentences
                                ...sentences.slice(0, numRevealed).map((sentence, si) => (
                                  <motion.div
                                    key={`${i}-${si}`}
                                    className="flex justify-start"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.22, ease }}
                                  >
                                    <div className="font-sans text-[14px] leading-[1.6] tracking-[-0.2px] rounded-2xl px-4 py-3" style={bubbleStyle}>
                                      {sentence}
                                    </div>
                                  </motion.div>
                                )),
                                // Typing indicator — shown while streaming OR between sentences
                                isTyping && (
                                  <motion.div
                                    key={`${i}-typing`}
                                    className="flex justify-start"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.18, ease }}
                                  >
                                    <div className="font-sans text-[14px] rounded-2xl px-4 py-3" style={{ background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                                      <span style={{ opacity: 0.35 }}>●●●</span>
                                    </div>
                                  </motion.div>
                                ),
                              ];
                            })}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Input or continue */}
                          {!chatDone ? (
                            <div className="flex flex-col gap-2">
                              {/* Quick-reply chips */}
                              <AnimatePresence>
                                {visibleChips.length > 0 && !streaming && (
                                  <motion.div
                                    className="flex flex-wrap gap-2"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.2, ease }}
                                  >
                                    {visibleChips.map(chip => (
                                      <button
                                        key={chip}
                                        onClick={() => sendMessage(chip)}
                                        className="font-sans text-[13px] tracking-[-0.25px] rounded-full px-3.5 py-2 border transition-all hover:border-[#111] hover:bg-[#111] hover:text-white"
                                        style={{ borderColor: "#E2E2E2", background: "white", color: "#333" }}
                                      >
                                        {chip}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="flex gap-2">
                                <input
                                  value={input}
                                  onChange={e => setInput(e.target.value)}
                                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                  placeholder="Or type your own…"
                                  disabled={streaming}
                                  className="flex-1 font-sans text-[14px] tracking-[-0.2px] rounded-full px-4 py-3 border bg-white outline-none transition-colors disabled:opacity-50"
                                  style={{ borderColor: "#E2E2E2" }}
                                  onFocus={e => (e.target.style.borderColor = "#111")}
                                  onBlur={e => (e.target.style.borderColor = "#E2E2E2")}
                                />
                                <button
                                  onClick={() => sendMessage()}
                                  disabled={streaming || !input.trim()}
                                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full disabled:opacity-30 transition-opacity hover:opacity-80"
                                  style={{ background: "#111" }}
                                >
                                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 13V3M3 8l5-5 5 5" />
                                  </svg>
                                </button>
                              </div>
                              <div className="flex justify-between">
                                <button onClick={() => goTo(hasContext ? "context" : "reason", -1)} className={backBtn}>Back</button>
                                <button onClick={() => goTo("details")} className={backBtn}>{messages.length > 0 || input.trim() ? "Next →" : "Skip →"}</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between pt-1">
                              <button onClick={() => goTo(hasContext ? "context" : "reason", -1)} className={backBtn}>Back</button>
                              <button
                                onClick={() => goTo("details")}
                                className={primaryBtn}
                                style={{ background: "#111", padding: "12px 24px" }}
                              >
                                Add my details →
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* ── Step 4: Details ── */}
                      {step === "details" && (
                        <div className="flex flex-col gap-4 flex-1">
                          <div className="flex flex-col gap-3.5 flex-1 overflow-y-auto">

                            {/* Honeypot — hidden from real users, bots fill it */}
                            <input
                              tabIndex={-1}
                              aria-hidden="true"
                              value={honeypot}
                              onChange={e => setHoneypot(e.target.value)}
                              style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0 }}
                            />

                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                              <label className="font-sans font-medium text-[11px] text-[#888] tracking-[0.5px] uppercase">Your name</label>
                              <input
                                value={details.name}
                                onChange={e => setDetails(prev => ({ ...prev, name: e.target.value }))}
                                placeholder=""
                                autoComplete="name"
                                className="font-sans text-[14px] tracking-[-0.2px] rounded-xl px-4 py-3 border bg-white outline-none transition-colors"
                                style={{ borderColor: "#E2E2E2" }}
                                onFocus={e => (e.target.style.borderColor = "#111")}
                                onBlur={e => (e.target.style.borderColor = "#E2E2E2")}
                              />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                              <label className="font-sans font-medium text-[11px] text-[#888] tracking-[0.5px] uppercase">Email address</label>
                              <input
                                value={details.email}
                                onChange={e => { setDetails(prev => ({ ...prev, email: e.target.value })); if (emailError) setEmailError(""); }}
                                placeholder=""
                                type="email"
                                autoComplete="email"
                                className="font-sans text-[14px] tracking-[-0.2px] rounded-xl px-4 py-3 border bg-white outline-none transition-colors"
                                style={{ borderColor: emailError ? "#E53935" : "#E2E2E2" }}
                                onFocus={e => (e.target.style.borderColor = emailError ? "#E53935" : "#111")}
                                onBlur={e => {
                                  if (details.email && !isValidEmail(details.email)) {
                                    setEmailError("Please enter a valid email address.");
                                    e.target.style.borderColor = "#E53935";
                                  } else {
                                    setEmailError("");
                                    e.target.style.borderColor = "#E2E2E2";
                                  }
                                }}
                              />
                              {emailError && <p className="font-sans text-[12px] text-[#E53935] tracking-[-0.2px]">{emailError}</p>}
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1.5">
                              <label className="font-sans font-medium text-[11px] text-[#888] tracking-[0.5px] uppercase">Phone (optional)</label>
                              <div className="flex gap-2">
                                <div className="relative shrink-0">
                                  <select
                                    value={details.countryCode}
                                    onChange={e => setDetails(prev => ({ ...prev, countryCode: e.target.value }))}
                                    className="font-sans text-[14px] tracking-[-0.2px] rounded-xl pl-3 pr-8 py-3 border bg-white outline-none transition-colors appearance-none w-full"
                                    style={{ borderColor: "#E2E2E2", color: "#111" }}
                                    onFocus={e => (e.target.style.borderColor = "#111")}
                                    onBlur={e => (e.target.style.borderColor = "#E2E2E2")}
                                  >
                                    {COUNTRY_CODES.map(c => (
                                      <option key={c.code + c.dial} value={c.dial}>{c.name} ({c.dial})</option>
                                    ))}
                                  </select>
                                  <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 4l4 4 4-4" />
                                  </svg>
                                </div>
                                <input
                                  value={details.phone}
                                  onChange={e => setDetails(prev => ({ ...prev, phone: e.target.value }))}
                                  placeholder=""
                                  type="tel"
                                  autoComplete="tel-national"
                                  className="flex-1 font-sans text-[14px] tracking-[-0.2px] rounded-xl px-4 py-3 border bg-white outline-none transition-colors"
                                  style={{ borderColor: "#E2E2E2" }}
                                  onFocus={e => (e.target.style.borderColor = "#111")}
                                  onBlur={e => (e.target.style.borderColor = "#E2E2E2")}
                                />
                              </div>
                            </div>

                            {/* Company */}
                            <div className="flex flex-col gap-1.5">
                              <label className="font-sans font-medium text-[11px] text-[#888] tracking-[0.5px] uppercase">Company (optional)</label>
                              <input
                                value={details.company}
                                onChange={e => setDetails(prev => ({ ...prev, company: e.target.value }))}
                                placeholder=""
                                autoComplete="organization"
                                className="font-sans text-[14px] tracking-[-0.2px] rounded-xl px-4 py-3 border bg-white outline-none transition-colors"
                                style={{ borderColor: "#E2E2E2" }}
                                onFocus={e => (e.target.style.borderColor = "#111")}
                                onBlur={e => (e.target.style.borderColor = "#E2E2E2")}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between pt-1">
                            <button onClick={() => goTo("chat", -1)} className={backBtn}>Back</button>
                            <button
                              onClick={handleSend}
                              disabled={!details.name || !details.email || !!emailError || sending}
                              className={primaryBtn}
                              style={{ background: "#111", padding: "12px 24px" }}
                            >
                              {sending ? "Sending…" : "Send to Steven →"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ── Step 5: Done ── */}
                      {step === "done" && (
                        <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center relative overflow-hidden">
                          {/* Floating particles */}
                          {[...Array(10)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute rounded-full pointer-events-none"
                              style={{
                                width:  [6, 8, 5, 7, 6, 9, 5, 8, 6, 7][i],
                                height: [6, 8, 5, 7, 6, 9, 5, 8, 6, 7][i],
                                background: ["#111","#555","#111","#888","#111","#444","#111","#666","#111","#333"][i],
                                left: `${[15,72,30,58,82,20,65,45,10,78][i]}%`,
                                top:  `${[20,15,70,80,30,55,65,10,42,75][i]}%`,
                              }}
                              initial={{ opacity: 0, scale: 0, y: 0 }}
                              animate={{ opacity: [0, 0.7, 0], scale: [0, 1, 0.8], y: -40 }}
                              transition={{ delay: i * 0.08, duration: 1.4, ease: "easeOut" }}
                            />
                          ))}

                          {/* Checkmark with ring pulse */}
                          <div className="relative">
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{ border: "2px solid #111" }}
                              initial={{ scale: 1, opacity: 0.6 }}
                              animate={{ scale: 1.8, opacity: 0 }}
                              transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                            />
                            <motion.div
                              className="w-20 h-20 rounded-full flex items-center justify-center"
                              style={{ background: "#111" }}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 280, damping: 18 }}
                            >
                              <motion.svg
                                width="26" height="26" viewBox="0 0 22 22" fill="none"
                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                              >
                                <motion.path d="M3 11l6 6L19 5" />
                              </motion.svg>
                            </motion.div>
                          </div>

                          <motion.div
                            className="flex flex-col gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.4, ease }}
                          >
                            <h3 className="font-sans font-medium text-[26px] text-[#111] tracking-[-1.3px]">
                              You're in good hands.
                            </h3>
                            <p className="font-sans text-[14px] text-[#888] leading-[1.65] tracking-[-0.2px] max-w-[280px] mx-auto">
                              I got your message. I'll read through everything and reach out personally, usually within a day or two.
                            </p>
                          </motion.div>

                          <motion.div
                            className="flex flex-col gap-2.5 w-full max-w-[320px]"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4, ease }}
                          >
                            {[
                              { icon: "📬", text: "Check your inbox. I reply personally." },
                              { icon: "📎", text: "Feel free to attach anything useful when you reply." },
                            ].map(item => (
                              <div key={item.icon} className="flex items-center gap-3 text-left px-4 py-3 rounded-2xl" style={{ background: "#F7F7F7" }}>
                                <span className="text-[18px] shrink-0">{item.icon}</span>
                                <p className="font-sans text-[13px] text-[#666] leading-[1.45] tracking-[-0.2px]">{item.text}</p>
                              </div>
                            ))}
                          </motion.div>

                          <motion.button
                            onClick={onClose}
                            className={primaryBtn}
                            style={{ background: "#111", padding: "12px 32px" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.3 }}
                          >
                            Close
                          </motion.button>
                        </div>
                      )}

                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
