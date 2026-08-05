"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const W = 600;
const H = 130;
const GROUND = 95;
const COW_X = 55;
const COW_W = 44;
const COW_H = 32;
const GRAVITY = 0.55;
const JUMP_V = -11.5;
const BASE_SPEED = 5;

type State = "idle" | "playing" | "dead";

interface Obs {
  x: number;
  w: number;
  h: number;
}

function drawCow(ctx: CanvasRenderingContext2D, y: number, frame: number) {
  const x = COW_X;
  const legSwing = Math.sin(frame * 0.3) * 5;
  const onGround = y >= GROUND - COW_H - 1;

  ctx.save();

  // Legs (animated when on ground)
  ctx.strokeStyle = "#0C0C12";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const legY = y + COW_H;
  const swing = onGround ? legSwing : 0;
  // back legs
  ctx.beginPath(); ctx.moveTo(x + 8,  legY - 2); ctx.lineTo(x + 6  + swing,  GROUND + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 15, legY - 2); ctx.lineTo(x + 13 - swing,  GROUND + 4); ctx.stroke();
  // front legs
  ctx.beginPath(); ctx.moveTo(x + 27, legY - 2); ctx.lineTo(x + 25 + swing,  GROUND + 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 34, legY - 2); ctx.lineTo(x + 32 - swing,  GROUND + 4); ctx.stroke();

  // Body
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#0C0C12";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, COW_W, COW_H, 10);
  ctx.fill();
  ctx.stroke();

  // Spots
  ctx.fillStyle = "#0C0C12";
  ctx.beginPath(); ctx.ellipse(x + 14, y + 10, 7, 5, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 28, y + 19, 5, 4,  0.3, 0, Math.PI * 2); ctx.fill();

  // Udder
  ctx.fillStyle = "#FFB6C1";
  ctx.strokeStyle = "#0C0C12";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x + 18, y + COW_H - 1, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#0C0C12";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x + COW_W + 4, y + 8, 12, 9, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Nose
  ctx.fillStyle = "#FFB6C1";
  ctx.beginPath();
  ctx.ellipse(x + COW_W + 12, y + 12, 5, 4, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Nostrils
  ctx.fillStyle = "#0C0C12";
  ctx.beginPath(); ctx.arc(x + COW_W + 10, y + 13, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + COW_W + 14, y + 13, 1.2, 0, Math.PI * 2); ctx.fill();

  // Eye
  ctx.fillStyle = "#0C0C12";
  ctx.beginPath(); ctx.arc(x + COW_W + 8, y + 4, 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath(); ctx.arc(x + COW_W + 9, y + 3.2, 0.7, 0, Math.PI * 2); ctx.fill();

  // Horn
  ctx.strokeStyle = "#D4A017";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + COW_W + 5, y + 0); ctx.lineTo(x + COW_W + 3, y - 7); ctx.stroke();

  // Tail
  ctx.strokeStyle = "#0C0C12";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 8);
  ctx.quadraticCurveTo(x - 10, y + 2 + Math.sin(frame * 0.2) * 4, x - 6, y - 5 + Math.sin(frame * 0.2) * 3);
  ctx.stroke();

  ctx.restore();
}

function drawMilkCarton(ctx: CanvasRenderingContext2D, obs: Obs) {
  const { x, w, h } = obs;
  const base = GROUND;

  ctx.save();

  // Body
  ctx.fillStyle = "#F0F0F0";
  ctx.strokeStyle = "#0C0C12";
  ctx.lineWidth = 1.5;
  ctx.fillRect(x, base - h, w, h);
  ctx.strokeRect(x, base - h, w, h);

  // Roof (triangle)
  ctx.fillStyle = "#E0E0E0";
  ctx.beginPath();
  ctx.moveTo(x, base - h);
  ctx.lineTo(x + w / 2, base - h - 10);
  ctx.lineTo(x + w, base - h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Label stripe
  ctx.fillStyle = "#0C0C12";
  ctx.fillRect(x + 3, base - h + 8, w - 6, h * 0.35);

  // Milk text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold ${Math.floor(w * 0.28)}px monospace`;
  ctx.textAlign = "center";
  ctx.fillText("milk", x + w / 2, base - h + 8 + h * 0.35 - 4);

  ctx.restore();
}

export default function CowGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<State>("idle");
  const cowYRef    = useRef(GROUND - COW_H);
  const cowVYRef   = useRef(0);
  const obsRef     = useRef<Obs[]>([]);
  const scoreRef   = useRef(0);
  const speedRef   = useRef(BASE_SPEED);
  const frameCount = useRef(0);
  const nextObs    = useRef(90);
  const rafRef     = useRef(0);
  const [uiState, setUiState]   = useState<State>("idle");
  const [score, setScore]       = useState(0);
  const [best, setBest]         = useState(0);

  const reset = useCallback((start = true) => {
    stateRef.current  = start ? "playing" : "idle";
    cowYRef.current   = GROUND - COW_H;
    cowVYRef.current  = 0;
    obsRef.current    = [];
    scoreRef.current  = 0;
    speedRef.current  = BASE_SPEED;
    frameCount.current = 0;
    nextObs.current   = 90;
    setScore(0);
    setUiState(start ? "playing" : "idle");
  }, []);

  const jump = useCallback(() => {
    if (stateRef.current === "idle" || stateRef.current === "dead") {
      reset(true);
      return;
    }
    if (cowYRef.current >= GROUND - COW_H - 2) {
      cowVYRef.current = JUMP_V;
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // Ground
      ctx.strokeStyle = "#0C0C12";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, GROUND + 4); ctx.lineTo(W, GROUND + 4); ctx.stroke();

      // Subtle ground dots
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let i = 0; i < 20; i++) {
        const dx = ((i * 40 - (frameCount.current * speedRef.current * 0.3)) % W + W) % W;
        ctx.beginPath(); ctx.arc(dx, GROUND + 9, 1.5, 0, Math.PI * 2); ctx.fill();
      }

      const st = stateRef.current;

      if (st === "idle") {
        drawCow(ctx, GROUND - COW_H, frameCount.current);
        ctx.fillStyle = "#B0B0B0";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Space · Click · Tap  to play", W / 2, GROUND + 22);

      } else if (st === "playing") {
        frameCount.current++;

        // Physics
        cowVYRef.current += GRAVITY;
        cowYRef.current  += cowVYRef.current;
        if (cowYRef.current >= GROUND - COW_H) {
          cowYRef.current  = GROUND - COW_H;
          cowVYRef.current = 0;
        }

        // Spawn obstacles
        nextObs.current--;
        if (nextObs.current <= 0) {
          const h = 30 + Math.random() * 22;
          const w = 22 + Math.random() * 10;
          obsRef.current.push({ x: W + 10, w, h });
          nextObs.current = 60 + Math.random() * 50 - scoreRef.current / 400;
        }

        // Move obstacles
        obsRef.current = obsRef.current
          .map(o => ({ ...o, x: o.x - speedRef.current }))
          .filter(o => o.x + o.w > 0);

        // Speed ramp
        speedRef.current = BASE_SPEED + scoreRef.current / 600;

        // Score
        scoreRef.current++;
        const pts = Math.floor(scoreRef.current / 6);
        if (scoreRef.current % 6 === 0) setScore(pts);

        // Collision (with margin)
        const margin = 6;
        for (const obs of obsRef.current) {
          if (
            COW_X + margin + COW_W - margin > obs.x + margin &&
            COW_X + margin < obs.x + obs.w - margin &&
            cowYRef.current + margin + COW_H > GROUND - obs.h
          ) {
            stateRef.current = "dead";
            setUiState("dead");
            setBest(b => Math.max(b, pts));
            break;
          }
        }

        // Draw obstacles then cow
        for (const obs of obsRef.current) drawMilkCarton(ctx, obs);
        drawCow(ctx, cowYRef.current, frameCount.current);

        // Score HUD
        ctx.fillStyle = "#B0B0B0";
        ctx.font = "12px monospace";
        ctx.textAlign = "right";
        ctx.fillText(String(Math.floor(scoreRef.current / 6)).padStart(5, "0"), W - 8, 16);

      } else {
        // Dead — freeze frame
        for (const obs of obsRef.current) drawMilkCarton(ctx, obs);
        drawCow(ctx, cowYRef.current, frameCount.current);

        // X eyes overlay — just darken eye area
        ctx.fillStyle = "#0C0C12";
        ctx.font = "10px monospace";
        ctx.textAlign = "left";
        ctx.fillText("×", COW_X + COW_W + 5, cowYRef.current + 7);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Best score */}
      {best > 0 && (
        <p className="font-mono text-[11px] text-[#B0B0B0] tracking-[-0.3px]">
          BEST &nbsp;{String(best).padStart(5, "0")}
        </p>
      )}

      <div className="relative w-full max-w-[600px]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full rounded-xl border border-black/[0.06] cursor-pointer"
          style={{ touchAction: "none", imageRendering: "crisp-edges" }}
          onClick={jump}
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
        />

        {/* Game over overlay */}
        {uiState === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
            <p className="font-sans font-medium text-[#0C0C12] text-[15px] tracking-[-0.5px]">Game Over</p>
            <p className="font-mono text-[11px] text-[#B0B0B0] tracking-[-0.3px]">
              Score &nbsp;{String(score).padStart(5, "0")}
            </p>
            <p className="font-mono text-[11px] text-[#B0B0B0] tracking-[-0.3px] mt-1">
              Space · Click · Tap to restart
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
