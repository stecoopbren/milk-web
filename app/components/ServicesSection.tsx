"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const services = [
  "Design Ops",
  "Business Model Design",
  "Service Design",
  "Process Design",
  "Market & User Research",
  "Product Design",
  "Design Systems",
  "AI Enablement",
  "Branding",
];

const serviceColors = [
  "#ABDDF0", // Design Leadership
  "#F08961", // Business Model Design
  "#E63929", // Service Design
  "#2BBFB0", // Process Design
  "#F7D54C", // Research Strategy
  "#F1A5D2", // Product Design
  "#A78BFA", // Design Systems
  "#54952E", // AI Enablement
  "#3D89C7", // Branding
];

const serviceTitles: Record<string, string> = {
  "Design Ops":            "My team is good. So why does everything take so long?",
  "Business Model Design": "Everyone loves the idea. I'm just not sure the numbers work.",
  "Service Design":        "The product works. The experience around it doesn't.",
  "Process Design":        "Smart people, slow output. That's where we are right now.",
  "Market & User Research":     "We keep building the wrong things for the right reasons.",
  "Product Design":        "I know what I want to build. I just can't make it real.",
  "Design Systems":        "Every launch looks like a different company made it.",
  "AI Enablement":         "Everyone's doing AI. I want to do it in a way that actually matters.",
  "Branding":              "We have great meetings. Nobody remembers us afterward.",
};

const serviceDescriptions: Record<string, { tagline: string; body: string }> = {
  "Design Ops": {
    tagline: "Making your design team fast, focused, and worth every dollar you put into it.",
    body: "Because the team is only one part of the equation. The other part is everything built around them: how decisions get made, how work moves, how quality holds as things scale. When that infrastructure is missing or broken, talented people spend their time compensating for it instead of doing the work they were hired to do.\n\nThe fix isn't hiring more designers or running more workshops. It's building the operating system your team actually works inside. Clear ownership, rituals that move things forward, and a direct line between design and the decisions that actually matter.\n\nThat's what I help you build.",
  },
  "Business Model Design": {
    tagline: "Validating the business behind the product before it costs you everything.",
    body: "That instinct is worth listening to. Most teams skip this conversation because it's uncomfortable, so they keep building and hope the model holds up. It usually doesn't.\n\nThe work here isn't complex. It's honest. We look at who's actually paying, when, how much, and what happens to the unit economics when things scale. We test the assumptions that are holding the whole thing up.\n\nSometimes the model is fine and you just need to see it clearly. Sometimes it needs a rethink before another dollar goes in.",
  },
  "Product Design": {
    tagline: "Designing products that feel obvious because nothing about them was accidental.",
    body: "The gap between a clear vision and a working product is usually not a design problem. It's a clarity problem. The vision exists in your head as a feeling. The product has to exist in the world as a series of decisions, and somewhere in that translation things get lost or compromised.\n\nThe work starts before any screen gets designed. We define what the product actually is, what it's for, what it's not, and what the person using it needs to feel at each step. We work closely with engineering so nothing gets lost between intention and implementation.\n\nBy the time we're done, the product should feel obvious to the people who use it. Not because it's simple, but because every decision behind it was deliberate.",
  },
  "Market & User Research": {
    tagline: "Getting to the right answer before your competitors ask the right question.",
    body: "This happens when research comes too late. By the time you're testing, you've already committed. The interviews confirm what you hoped rather than challenge what you assumed.\n\nSharp research starts before you know what you're building. It asks uncomfortable questions early, when the cost of changing direction is still low. It defines what you actually need to know, not what you'd like to know, and finds the fastest way to find it.\n\nThe goal isn't more data. It's fewer wrong decisions.",
  },
  "Service Design": {
    tagline: "Designing the full experience, not just the screen.",
    body: "This is more common than most teams admit. The interface ships, the core functionality works, but customers still struggle. They call support. They drop off at moments that shouldn't be hard. They get confused by things the team considers obvious.\n\nThat's because the experience isn't just the screen. It's every touchpoint, every handoff, every gap between what your system was designed to do and what actually happens when a real person uses it.\n\nWe map the full picture: what customers see and what happens behind the scenes to make it possible. Then we redesign the parts that are quietly costing you.",
  },
  "Process Design": {
    tagline: "Designing how your team works, not just what they build.",
    body: "When the people are good but the output is slow, the problem is almost never the people. It's the invisible friction they're swimming through: unclear ownership, handoffs that lose context, meetings that answer questions that could have been a document, decisions that loop back to the same conversation three times.\n\nThe fix isn't adding process. It's removing the obstacles that keep talented people from doing their best work.\n\nWe start by understanding how work actually moves through your team. Then we redesign it: the rituals, the structure, the decision-making, so the system matches the people inside it.",
  },
  "Branding": {
    tagline: "Creating an identity that earns trust before you say a word.",
    body: "That's a brand problem. Not a visual one. A consistency one. The meeting goes well because you show up prepared and say the right things. But the impression doesn't stick because there's nothing underneath it strong enough to hold.\n\nA brand isn't what you say in a pitch. It's what people feel after you've left the room. The visual identity, the way you write, the experience of working with you, the things you stand for that nobody has to explain. All of it has to add up to the same thing, every time.\n\nWe start by defining what that thing is. Then we build the expression around it: identity, voice, touchpoints, so that the memory of you is consistent whether someone met you in a meeting, read your website, or just saw your name somewhere.",
  },
  "AI Enablement": {
    tagline: "Helping your team work with AI before AI works around them.",
    body: "Most AI initiatives fail for the same reason: they ask 'what can we add?' before they ask 'how do we actually work?' You end up with AI tools sitting on top of unchanged processes, delivering a fraction of what they could.\n\nThe companies getting this right aren't adding AI to their product first. They're rethinking how their teams make decisions, where they spend time, and what they're trying to get done. Then they find the places where AI creates real leverage.\n\nWe start there. With honesty about what your team actually does, what creates value, and where intelligent automation would genuinely free people to do better work, not just faster versions of the same work.",
  },
  "Design Systems": {
    tagline: "Building the foundation that makes every future decision easier.",
    body: "It does, because every team is solving the same problems from scratch. The button gets designed three ways. The spacing is different on every surface. Nobody's wrong. There's just no shared language, so everyone invents their own.\n\nA design system is that shared language. Not a component library that nobody uses, but a living set of decisions: principles, patterns, documented standards, that make consistency the path of least resistance instead of an extra effort.\n\nWe build it with the people who will use it, document it in a way that actually gets read, and govern it in a way that scales without becoming bureaucracy. Every decision made once. Every launch from the same foundation.",
  },
};


const serviceCtas: Record<string, string> = {
  "Design Ops":            "Talent isn't the bottleneck. The system around it is. Let's fix that.",
  "Business Model Design": "Let's find out if the numbers work before you bet everything on them.",
  "Service Design":        "Your customers feel every part of it, not just the screen. Let's design all of it.",
  "Process Design":        "The way you work is a design problem too. Let's redesign it.",
  "Market & User Research":     "Let's find out what's actually true before you build anything else.",
  "Product Design":        "That gap between vision and product is exactly where we work.",
  "Design Systems":        "One system. Every decision made once. Let's build it.",
  "AI Enablement":         "The companies that get AI right redesign how they think first. Let's start there.",
  "Branding":              "A brand that earns trust before you say a word changes every conversation you'll ever have. Let's build yours.",
};

const serviceQuotes: Record<string, string> = {
  "Design Ops":            "Speed in a design team is almost never about the designers. It's about the hundred small decisions nobody made about how the work actually moves.",
  "Business Model Design": "That uncertainty isn't a weakness. It's the most honest thing you've said. Most founders skip that question entirely and find out the hard way.",
  "Service Design":        "The app is never the whole experience. It's just the part that's easiest to point at.",
  "Process Design":        "I've never walked into a team where the talent was the problem. It's always the system the talent is trying to work inside of.",
  "Market & User Research":     "Good intentions and wrong assumptions cost exactly the same amount. Research is just the discipline of finding out earlier.",
  "Product Design":        "The vision is never the problem. It's the translation. Every step between your head and the product is a decision, and most of them get made by default.",
  "Design Systems":        "Inconsistency isn't a design problem. It's a coordination problem. The system is just the agreement everyone needed to have anyway.",
  "AI Enablement":         "The teams that will win with AI aren't the ones moving fastest. They're the ones who stopped to ask what they were actually trying to do.",
  "Branding":              "Being likeable in a room is not the same as being memorable after you've left it. That gap is exactly where brand lives.",
};

export default function ServicesSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div
      id="services"
      className="snap-section relative"
      data-native-scroll="true"
      style={{ scrollSnapAlign: "none", paddingTop: 100, paddingBottom: 80 }}
    >
      <div className="px-8 lg:px-[180px]">

        <div className="flex flex-col lg:flex-row lg:gap-32 lg:items-start">

          {/* Left: sticky heading */}
          <div className="mb-12 lg:mb-0 lg:w-[38%] lg:shrink-0 lg:sticky lg:self-start text-left" style={{ top: "50vh", transform: "translateY(-50%)" }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
            >
            <p className="text-serif-eyebrow text-[#0C0C12] mb-5">What do I actually do?</p>
            <h2
              style={{
                fontFamily: "Ambit",
                fontWeight: 700,
                fontSize: "clamp(36px, 4vw, 64px)",
                letterSpacing: "-0.05em",
                lineHeight: 0.92,
                color: "#0C0C12",
              }}
            >
              Think it through.<br />Then build it right.
            </h2>
            </motion.div>
          </div>

          {/* Right: FAQ accordion */}
          <div className="flex-1 min-w-0">
            {services.map((service, i) => {
              const isOpen = expanded === i;
              return (
                <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #E0E0E0" }}>
                  {/* Header */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 text-left"
                    style={{ paddingTop: 26, paddingBottom: 26 }}
                  >
                    <div className="flex items-center min-w-0">
                      <span
                        style={{
                          fontFamily: "Ambit",
                          fontWeight: 700,
                          fontSize: "clamp(16px, 1.4vw, 22px)",
                          letterSpacing: "-0.03em",
                          color: "#0C0C12",
                          lineHeight: 1.25,
                        }}
                      >
                        {service}
                      </span>
                    </div>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease }}
                      width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="#0C0C12" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </motion.svg>
                  </button>

                  {/* Expanded body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.38, ease }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ paddingBottom: 36 }}>

                          {/* Body */}
                          <div className="flex flex-col gap-3">
                            {serviceDescriptions[service]?.body.split("\n\n").map((para, j) => (
                              <p key={j} className="text-body" style={{ color: "#4A4A4A" }}>{para}</p>
                            ))}
                          </div>

                          {/* CTA block */}
                          <div className="mt-8 pl-5 border-l-2 border-[#0C0C12] flex flex-col gap-3">
                            <p className="text-body text-[#0C0C12]" style={{ fontWeight: 500 }}>
                              {serviceCtas[service]}
                            </p>
                            <motion.button
                              onClick={() => window.dispatchEvent(new CustomEvent("milk:open-contact", { detail: { service } }))}
                              className="inline-flex items-center justify-center font-sans font-medium text-[13px] text-white tracking-[-0.3px] rounded-full w-fit"
                              style={{ background: "#1a1a1a", padding: "9px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}
                              whileHover={{ opacity: 0.82 }}
                              whileTap={{ scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                            >
                              Start this conversation
                            </motion.button>
                          </div>


                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
