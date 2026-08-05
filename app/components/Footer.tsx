"use client";

import { useState } from "react";

const navColumns = [
  {
    label: "Navigate",
    links: [
      { label: "About",     href: "/#who-we-are" },
      { label: "Method",    href: "/#method" },
      { label: "Work",      href: "/#portfolio" },
      { label: "Portfolio", href: "/portfolio" },
    ],
  },
  {
    label: "Services",
    links: [
      { label: "Design Ops",         href: "/#services" },
      { label: "Business Design",    href: "/#services" },
      { label: "Product Design",     href: "/#services" },
      { label: "Design Systems",     href: "/#services" },
      { label: "Branding",           href: "/#services" },
      { label: "AI Enablement",      href: "/#services" },
    ],
  },
  {
    label: "Cases",
    links: [
      { label: "Chagüite",              href: "/cases/regenerative-community" },
      { label: "Casa Siwä",             href: "/cases/casa-siwa" },
      { label: "Digital Transformation", href: "/cases/gxm" },
    ],
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/steven-cooper-brenes/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
        <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/milkdotdesign/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@stevencooper_75268",
    icon: (
      <svg width="18" height="18" viewBox="0 0 640 512" fill="currentColor">
        <path d="M180.5 74.3C80.8 74.3 0 155.6 0 256S80.8 437.7 180.5 437.7 361 356.4 361 256 280.2 74.3 180.5 74.3zm288.3 10.6c-49.8 0-90.2 76.6-90.2 171.1s40.4 171.1 90.2 171.1 90.3-76.6 90.3-171.1-40.5-171.1-90.3-171.1zm139.5 17.8c-17.5 0-31.7 68.6-31.7 153.3s14.2 153.3 31.7 153.3S640 340.6 640 256c0-84.9-14.2-153.3-31.7-153.3z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to newsletter service (Mailchimp, Beehiiv, ConvertKit, etc.)
    setStatus("success");
  };

  return (
    <section id="contact" className="snap-section relative overflow-hidden flex flex-col bg-[#EFEFEF]">

      {/* ── Top content row ─────────────────────────────────────────────────── */}
      <div
        className="flex flex-col lg:flex-row gap-12 lg:gap-0 px-8 lg:px-[180px] pt-16 pb-12"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        {/* Newsletter — left */}
        <div className="flex flex-col gap-5 lg:max-w-[360px] lg:pr-24 lg:border-r lg:border-black/[0.08]">
          <p className="font-mono uppercase text-[#9D9AA0]" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
            Stay in the loop
          </p>
          <p className="font-sans text-[#2E2E2E] text-[15px] tracking-[-0.3px] leading-[1.4]">
            Strategy, craft, and things worth thinking about. No noise.
          </p>

          {status === "success" ? (
            <p className="font-sans text-[14px] text-[#9D9AA0] tracking-[-0.28px]">
              You&apos;re in. Good taste confirmed.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex mt-1">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-0 bg-transparent border border-black/10 rounded-l-full px-4 py-2.5 font-sans text-[14px] text-[#0C0C12] placeholder:text-[#B0B0B0] focus:outline-none focus:border-black/25 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 bg-[#0C0C12] text-white font-sans font-medium text-[13px] tracking-[-0.26px] px-5 py-2.5 rounded-r-full hover:bg-[#2E2E2E] transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Nav columns + socials — right */}
        <div className="flex flex-1 gap-12 lg:pl-24 lg:justify-start">
          {navColumns.map((col) => (
            <div key={col.label} className="flex flex-col gap-4">
              <p className="font-mono uppercase text-[#9D9AA0]" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
                {col.label}
              </p>
              <nav className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-sans text-[14px] text-[#565656] hover:text-[#0C0C12] transition-colors tracking-[-0.28px]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom strip ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 lg:px-[180px] py-5">
        <p className="font-mono text-[11px] text-[#9D9AA0] tracking-[-0.3px]">
          © 2026 Milk Design Studio · Crafted with love in Costa Rica
        </p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-[#9D9AA0] hover:text-[#0C0C12] transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Giant wordmark ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden leading-none select-none" style={{ height: "calc(26vw * 0.66)" }} aria-hidden="true">
        <span
          className="block font-bold whitespace-nowrap"
          style={{
            fontFamily: "Ambit",
            fontSize: "clamp(80px, 26vw, 420px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: "#C9C7CC",
          }}
        >
          Milk.
        </span>
      </div>

    </section>
  );
}
