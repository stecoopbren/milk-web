# Milk Design Studio — Project Conventions

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (config in globals.css `@theme inline`, no tailwind.config.ts)
- Framer Motion v12 for all animations
- `next/font/google` for DM Sans + DM Mono

## Responsive Strategy
- Mobile-first with Tailwind breakpoints
- `md:` = 768px (tablet)
- `lg:` = 1024px (desktop)
- Desktop horizontal padding: `px-[180px]`
- Mobile horizontal padding: `px-8`
- Desktop scroll snap enabled (`scroll-snap-type: y mandatory` on html)
- Each section uses `snap-section` class on desktop for full-viewport snap

## Component Location
All components live in `app/components/`

## Typography
- DM Sans → headings and body (`font-sans`)
- DM Mono → uppercase labels (`font-mono`, always uppercase)
- Display: 56px / -3.36px tracking / 0.85 line-height
- H1: 40px mobile, 56px desktop / tight tracking
- H2: 32px / -1.92px tracking
- H4: 20px / -1px tracking
- Body: 16px / 1.2 line-height / -0.32px tracking
- Label: 16px mono / -0.48px tracking
- Small: 12px mono / -0.48px tracking

## Colors (use CSS vars or Tailwind tokens)
- Background: `#FAFAFA`
- Footer bg: `#1F1F20`
- Text primary: `#2F2F2F`
- Text secondary: `#565656`
- Text darkest: `#0C0C12`
- Accent pink: `#FF3377`
- Dark text: `#EFEFEF` (on dark bg)

## Glass Effect
Use `.glass` utility class for all glassmorphic elements:
- Radial gradient white bg + backdrop blur + white border + shadow

## Animation Principles
- Shared easing: `[0.22, 1, 0.36, 1]`
- Scroll reveals: `useInView(ref, { once: true, margin: "-80px" })`
- Entrance: fade up from `y: 24, opacity: 0` → `y: 0, opacity: 1`
- Stagger children: 0.1s delay between each
- Background: GPU blob (mouse-reactive, scroll-depth aware)

## Section Structure
Each section = `min-h-screen` + `flex items-center justify-center` + `snap-section`
Sections: Nav (fixed), Hero, Statement, Method, Projects, Footer

## Tone of Voice

Milk's copy uses **positive reframing** (gain framing): always lead with what's possible, real, or right — never with what's wrong, broken, or missing. This applies to site copy, case study writing, and any new content.

### Core principles

**1. Destination over deficit**
Lead with where you're going, not what went wrong.
- Avoid: "Most founders build the wrong thing."
- Prefer: "The clearest founders start by finding the real problem."

**2. "Real" over "right/wrong"**
"Wrong" implies blame. "Real" implies clarity. Steven's role is to reveal, not correct.
- Avoid: "wrong strategy", "wrong assumption", "wrong direction"
- Prefer: "the real question", "the actual constraint", "what was missing"

**3. Curiosity over diagnosis**
Frame the before-state as an open question, not a broken state.
- Avoid: "The problem was that the brand had no direction."
- Prefer: "The question we kept coming back to: what does this brand actually stand for?"

**4. Outcomes over obstacles in case studies**
Structure: what was missing → what we found → what it unlocked.
Not: problem → solution → result (too clinical).
Prefer: question → clarity → momentum.

**5. No em dashes**
Em dashes (—) are prohibited in all copy. Use commas, colons, or rewrite the sentence.

### Voice qualities
- Confident but not arrogant
- Precise but not cold
- Strategic but conversational
- Never uses jargon to sound smart — uses plain language to sound sharp

---

## Case Study Content Formula

Apply this formula to every case and sub-case. It defines the systematic tone and structure of all case copy.

### Hero Title
A reframe that challenges the obvious assumption about why the client struggled. Never "what we did" — always "what was actually true."

Two formats:
- **Contrast:** `[What existed]. Not [what it should have been].` → *"Built from culture. Not from mood boards."*
- **Reframe:** `The [thing] was never the [expected problem].` → *"The expertise was never the problem."*

Rules: max 8 words per line, 2 lines, always ends with a period.

### Hero Subtitle
Three beats, in order, max 55 words total:
1. **Who** — one factual sentence, no adjectives beyond what the story earns
2. **The gap** — what existed vs. what was missing (the real problem, not the symptoms)
3. **The stakes** — time, pressure, or outcome; end on the sharpest line

### Section Label
2–3 words. Describes the phase, not the outcome. Examples: `The client` / `Kick Off` / `The method` / `Impact`

### Section Heading
One sharp statement about what changed or was found. Two formats:
- **Contrast:** `[Tension]. [Resolution hint].` → *"Evidence over assumption. At every step."*
- **Direct:** `[Simple declarative of what shifted].` → *"One room. The full picture."*

Max 10 words. No questions. Ends with a period.

### Body Copy
Three-move structure per section:
1. Open with the tension or question — not the answer
2. Move through: what existed → what was found → what changed
3. Close on the sharpest insight, not the most information

Two paragraphs max. Each paragraph: one idea, 3–5 sentences.

### Impact Section
- **Heading:** `Why [this] was different.` or `[What happened] because [what changed].`
- **Left column:** The opening fact, punchy, 1–2 sentences
- **Right column:** The mechanism and the result
- **Bullets:** 4 max, each under 10 words, outcome not process

### What to avoid in all case copy
- Em dashes (rewrite or use a colon)
- "Wrong", "broken", "failed" — use "what wasn't working" or "what was missing"
- Naming clients under NDA anywhere in the copy
- Ending a section on process — always end on outcome or insight
- Adjectives that aren't earned by the specific story
- More than 4 bullets in any list
