"use client";

export default function FilmGrain() {
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          >
            <animate
              attributeName="seed"
              from="0"
              to="200"
              dur="0.4s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 9998,
          filter: "url(#film-grain)",
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}
