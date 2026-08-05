"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Track = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumArt?: string | null;
  songUrl?: string;
  previewUrl?: string | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

const BAR_PEAKS = [0.45, 0.75, 0.55, 1, 0.65, 0.85, 0.5, 0.7, 0.4, 0.9];

function EqBars({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-[2px] shrink-0" style={{ height: 18 }}>
      {BAR_PEAKS.map((peak, i) => (
        <motion.span
          key={i}
          style={{
            display: "block",
            width: 2,
            height: 18,
            background: "#0C0C12",
            borderRadius: 1,
            transformOrigin: "50% 100%",
          }}
          animate={
            playing
              ? { scaleY: [peak * 0.25, peak, peak * 0.55, Math.min(peak * 1.15, 1), peak * 0.35] }
              : { scaleY: 0.1 }
          }
          transition={
            playing
              ? { duration: 0.55 + i * 0.07, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: i * 0.055 }
              : { duration: 0.4, ease }
          }
        />
      ))}
    </div>
  );
}

export default function NowPlaying() {
  const [track, setTrack]   = useState<Track | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res  = await fetch("/api/spotify");
        const data = await res.json();
        setTrack(data);
      } catch {
        // silent — widget just stays hidden
      }
    };
    fetch_();
    const id = setInterval(fetch_, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioOn && track?.previewUrl) {
      audio.src = track.previewUrl;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [audioOn, track?.previewUrl]);

  // Reset audio when song changes
  useEffect(() => {
    if (audioOn) setAudioOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.title]);

  return (
    <AnimatePresence>
      {track?.isPlaying && (
        <motion.div
          key="now-playing"
          className="fixed bottom-6 left-6 z-50"
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: 20, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          {/* Glass pill — matches Nav */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "rgba(250,250,250,0.88)",
              backdropFilter: "blur(40px) saturate(160%)",
              WebkitBackdropFilter: "blur(40px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 2px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.8) inset",
              borderRadius: 20,
              padding: "10px 14px 12px",
              width: 272,
            }}
          >
            {/* Specular sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0"
              style={{
                height: "45%",
                borderRadius: "20px 20px 0 0",
                background: "linear-gradient(to bottom, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 100%)",
              }}
            />

            {/* Header */}
            <p
              className="font-mono uppercase text-[#9D9AA0] mb-2.5"
              style={{ fontSize: 9, letterSpacing: "0.12em" }}
            >
              Now Listening
            </p>

            {/* Main row */}
            <div className="flex items-center gap-3">
              {/* Album art */}
              {track.albumArt && (
                <img
                  src={track.albumArt}
                  alt={track.title}
                  style={{ width: 40, height: 40, borderRadius: 7, flexShrink: 0, objectFit: "cover" }}
                />
              )}

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-[13px] text-[#0C0C12] tracking-[-0.3px] truncate leading-tight">
                  {track.title}
                </p>
                <p className="font-sans text-[11px] text-[#9D9AA0] tracking-[-0.2px] truncate leading-tight mt-0.5">
                  {track.artist}
                </p>
              </div>

              {/* EQ bars */}
              <EqBars playing={track.isPlaying} />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              {/* Preview toggle */}
              <button
                onClick={() => setAudioOn(o => !o)}
                disabled={!track.previewUrl}
                className="inline-flex items-center gap-1.5 text-[#565656] hover:text-[#0C0C12] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-dm-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                {audioOn ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <rect x="1.5" y="1" width="2.5" height="8" rx="0.6" />
                    <rect x="6"   y="1" width="2.5" height="8" rx="0.6" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 1.5L9 5L2 8.5V1.5Z" />
                  </svg>
                )}
                {audioOn ? "Pause preview" : "Play preview"}
              </button>

              {/* Spotify link */}
              {track.songUrl && (
                <a
                  href={track.songUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "var(--font-dm-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1DB954" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Open in Spotify
                </a>
              )}
            </div>
          </div>

          <audio ref={audioRef} loop />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
