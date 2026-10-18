"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { MediumPost } from "@/app/api/medium/route";

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 13L13 3M13 3H6M13 3v7" />
    </svg>
  );
}

// ─── Dots ────────────────────────────────────────────────────────────────────

function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === active ? "h-[6px] w-5 bg-[#0C0C12]" : "h-[6px] w-[6px] bg-[#C0C0C0]"
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
      className="group flex flex-shrink-0 flex-col overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white transition-colors duration-300 hover:border-[#D0D0D0]"
      style={{ width: "clamp(272px, calc(100vw - 88px), 360px)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease }}
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 overflow-hidden bg-[#F2F2F2]" style={{ height: 223 }}>
        {post.thumbnail ? (
          <Image
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={!/^https:\/\/([a-z0-9-]+\.)*medium\.com\//.test(post.thumbnail)}
            src={post.thumbnail}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#F0F0F0] to-[#E4E4E4]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Date */}
        {post.publishedAt && (
          <p className="text-micro text-[#A0A0A0]">{formatDate(post.publishedAt)}</p>
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
          <p className="text-body line-clamp-2 flex-1 text-[#565656]" style={{ fontSize: 14 }}>
            {post.excerpt}
          </p>
        )}

        {/* CTA */}
        <span className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-[#2E2E2E]/20 px-5 py-2 font-sans text-[13px] font-medium tracking-[-0.3px] text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/50">
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
      className="flex-shrink-0 animate-pulse overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white"
      style={{ width: "clamp(272px, calc(100vw - 88px), 360px)" }}
    >
      <div style={{ height: 223 }} className="bg-[#F0F0F0]" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-2.5 w-14 rounded-full bg-[#F0F0F0]" />
        <div className="h-5 w-full rounded-md bg-[#F0F0F0]" />
        <div className="h-5 w-3/4 rounded-md bg-[#F0F0F0]" />
        <div className="mt-1 h-4 w-full rounded-md bg-[#F0F0F0]" />
        <div className="h-4 w-5/6 rounded-md bg-[#F0F0F0]" />
        <div className="mt-2 h-4 w-24 rounded-full bg-[#F0F0F0]" />
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
      className="snap-section flex flex-col justify-center bg-white"
      style={{ minHeight: "100svh", paddingTop: 80, paddingBottom: 80 }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.div
        className="mb-10 flex flex-col items-center gap-3 px-8 text-center lg:px-[180px]"
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
        className="hide-scrollbar flex gap-4"
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
        className="mt-8 flex items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      >
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="inline-flex items-center justify-center rounded-full border border-[#2E2E2E]/15 p-2.5 text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40 disabled:pointer-events-none disabled:opacity-25"
          aria-label="Previous posts"
        >
          <ChevronLeft />
        </button>
        <Dots count={count} active={activeIndex} />
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="inline-flex items-center justify-center rounded-full border border-[#2E2E2E]/15 p-2.5 text-[#2E2E2E] transition-colors hover:border-[#2E2E2E]/40 disabled:pointer-events-none disabled:opacity-25"
          aria-label="Next posts"
        >
          <ChevronRight />
        </button>
      </motion.div>
    </section>
  );
}
