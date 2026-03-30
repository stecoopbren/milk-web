"use client";

import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  blur: number;
  speedX: number;
  speedY: number;
  depth: number;
  phase: number;
}

export default function MilkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const blobs: Blob[] = [
      { x: 0.25, y: 0.3,  tx: 0.25, ty: 0.3,  size: 520, color: "rgba(255,180,210,0.18)", blur: 80, speedX: 0.0003, speedY: 0.0004, depth: 0.06, phase: 0 },
      { x: 0.75, y: 0.2,  tx: 0.75, ty: 0.2,  size: 480, color: "rgba(180,210,255,0.14)", blur: 90, speedX: 0.0005, speedY: 0.0003, depth: 0.04, phase: 1.5 },
      { x: 0.5,  y: 0.65, tx: 0.5,  ty: 0.65, size: 560, color: "rgba(210,255,220,0.12)", blur: 100, speedX: 0.0004, speedY: 0.0005, depth: 0.05, phase: 3 },
      { x: 0.15, y: 0.8,  tx: 0.15, ty: 0.8,  size: 400, color: "rgba(255,230,180,0.13)", blur: 85, speedX: 0.0006, speedY: 0.0004, depth: 0.03, phase: 4.5 },
    ];

    let W = 0, H = 0;
    let t = 0;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    const onScroll = () => { scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1); };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);

      for (const b of blobs) {
        const idleX = b.x + Math.sin(t * b.speedX * 1000 + b.phase) * 0.04;
        const idleY = b.y + Math.cos(t * b.speedY * 1000 + b.phase) * 0.04;
        const targetX = idleX + (mouseRef.current.x - 0.5) * b.depth;
        const targetY = idleY + (mouseRef.current.y - 0.5) * b.depth + scrollRef.current * b.depth * 0.5;

        b.tx = lerp(b.tx, targetX, 0.04);
        b.ty = lerp(b.ty, targetY, 0.04);

        const grd = ctx.createRadialGradient(b.tx * W, b.ty * H, 0, b.tx * W, b.ty * H, b.size);
        grd.addColorStop(0, b.color);
        grd.addColorStop(1, "rgba(0,0,0,0)");

        ctx.save();
        ctx.filter = `blur(${b.blur}px)`;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(b.tx * W, b.ty * H, b.size, b.size * 0.75, t * 0.1 + b.phase, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, willChange: "transform" }}
    />
  );
}
