"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import type { MediumPost } from "@/app/api/medium/route";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}

// ─── Dots ────────────────────────────────────────────────────────────────────

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === active ? "w-5 h-[6px] bg-[#0C0C12]" : "w-[6px] h-[6px] bg-[#C0C0C0]"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({ post, index }: { post: MediumPost; index: number }) {
  return (
    <motion.a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] flex-shrink-0 hover:border-[#D0D0D0] transition-colors duration-300"
      style={{ width: "clamp(272px, calc(100vw - 88px), 360px)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease }}
    >
      {/* Thumbnail */}
      <div className="overflow-hidden bg-[#F2F2F2] flex-shrink-0" style={{ height: 223 }}>
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F0F0F0] to-[#E4E4E4]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Date */}
        {post.publishedAt && (
          <p className="text-micro text-[#A0A0A0]">
            {formatDate(post.publishedAt)}
          </p>
        )}

        {/* Title */}
        <h3
          className="text-subheading line-clamp-3 text-[#2F2F2F]"
          style={{ fontSize: 18, lineHeight: 1.15 }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-body text-[#565656] line-clamp-2 flex-1" style={{ fontSize: 14 }}>
            {post.excerpt}
          </p>
        )}

        {/* CTA */}
        <span className="mt-auto border border-[#2E2E2E]/20 rounded-full px-5 py-2 font-sans font-medium text-[13px] text-[#2E2E2E] tracking-[-0.3px] transition-colors hover:border-[#2E2E2E]/50 inline-flex items-center gap-2 self-start">
          Read on Medium
          <IconArrowUpRight />
        </span>
      </div>
    </motion.a>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-[#EBEBEB] animate-pulse"
      style={{ width: "clamp(272px, calc(100vw - 88px), 360px)" }}
    >
      <div style={{ height: 223 }} className="bg-[#F0F0F0]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-2.5 w-14 bg-[#F0F0F0] rounded-full" />
        <div className="h-5 w-full bg-[#F0F0F0] rounded-md" />
        <div className="h-5 w-3/4 bg-[#F0F0F0] rounded-md" />
        <div className="h-4 w-full bg-[#F0F0F0] rounded-md mt-1" />
        <div className="h-4 w-5/6 bg-[#F0F0F0] rounded-md" />
        <div className="h-4 w-24 bg-[#F0F0F0] rounded-full mt-2" />
      </div>
    </div>
  );
}

// ─── Blog Section ─────────────────────────────────────────────────────────────

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10%" });

  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/medium")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateScrollBtns = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    const cardW = Math.min(360, window.innerWidth - 88);
    setActiveIndex(Math.round(el.scrollLeft / (cardW + 16)));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setTimeout(updateScrollBtns, 100);
    return () => clearTimeout(timer);
  }, [posts, updateScrollBtns]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = Math.min(360, window.innerWidth - 88);
    el.scrollBy({ left: dir === "left" ? -(cardW + 16) : cardW + 16, behavior: "smooth" });
  };

  if (!loading && posts.length === 0) return null;

  const count = loading ? 3 : posts.length;

  return (
    <section
      ref={sectionRef}
      className="snap-section bg-white flex flex-col justify-center"
      style={{ minHeight: "100svh", paddingTop: 80, paddingBottom: 80 }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col items-center gap-3 px-8 lg:px-[180px] mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease }}
      >
        <p className="text-serif-eyebrow text-[#0C0C12]">( Writing )</p>
        <h2
          className="text-[#2F2F2F]"
          style={{
            fontFamily: "Ambit, sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          On the blog
        </h2>
      </motion.div>

      {/* ── Carousel ────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={updateScrollBtns}
        data-horizontal-scroll="true"
        className="flex gap-4 hide-scrollbar"
        style={{
          overflowX: "auto",
          paddingLeft: "clamp(32px, 12.5vw, 180px)",
          paddingRight: "clamp(32px, 12.5vw, 180px)",
          WebkitOverflowScrolling: "touch" as never,
        }}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}

        <div style={{ flexShrink: 0, width: 1 }} aria-hidden />
      </div>

      {/* ── Controllers ─────────────────────────────────────────────────── */}
      <motion.div
        className="flex items-center justify-center gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Previous posts"
        >
          <ChevronLeft />
        </button>
        <Dots count={count} active={activeIndex} />
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="border border-[#2E2E2E]/15 rounded-full p-2.5 inline-flex items-center justify-center text-[#2E2E2E] hover:border-[#2E2E2E]/40 transition-colors disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Next posts"
        >
          <ChevronRight />
        </button>
      </motion.div>
    </section>
  );
}
