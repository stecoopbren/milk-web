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
