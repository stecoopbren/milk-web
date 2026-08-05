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

export default function MilkBackground({ contained = false }: { contained?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const rafRef = useRef<number>(0);
  // nudge: extra drift amplitude added after hero text settles
  const nudgeAmpRef = useRef(0);
  const nudgeTargetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = "ontouchstart" in window;

    const blobs: Blob[] = [
      { x: 0.25, y: 0.3,  tx: 0.25, ty: 0.3,  size: 520, color: "rgba(255,180,210,0.38)", blur: 80,  speedX: 0.0003, speedY: 0.0004, depth: 0.28, phase: 0   },
      { x: 0.75, y: 0.2,  tx: 0.75, ty: 0.2,  size: 480, color: "rgba(180,210,255,0.32)", blur: 90,  speedX: 0.0005, speedY: 0.0003, depth: 0.20, phase: 1.5 },
      { x: 0.5,  y: 0.65, tx: 0.5,  ty: 0.65, size: 560, color: "rgba(210,255,220,0.28)", blur: 100, speedX: 0.0004, speedY: 0.0005, depth: 0.24, phase: 3   },
      { x: 0.15, y: 0.8,  tx: 0.15, ty: 0.8,  size: 400, color: "rgba(255,230,180,0.30)", blur: 85,  speedX: 0.0006, speedY: 0.0004, depth: 0.16, phase: 4.5 },
    ];

    let W = 0, H = 0;
    let t = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      W = canvas.width  = contained && parent ? parent.offsetWidth  : window.innerWidth;
      H = canvas.height = contained && parent ? parent.offsetHeight : window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onScroll = () => { scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1); };
    window.addEventListener("scroll", onScroll, { passive: true });

    let gyroCleanup = () => {};

    if (isMobile) {
      // C: touch-reactive
      const onTouch = (e: TouchEvent) => {
        const touch = e.touches[0];
        mouseRef.current = { x: touch.clientX / window.innerWidth, y: touch.clientY / window.innerHeight };
      };
      window.addEventListener("touchmove", onTouch, { passive: true });

      // A: gyroscope — drives blobs when not touching
      const onOrientation = (e: DeviceOrientationEvent) => {
        const gamma = e.gamma ?? 0;   // left/right tilt: -90 to 90
        const beta  = e.beta  ?? 45;  // front/back tilt: -180 to 180
        mouseRef.current = {
          x: Math.max(0, Math.min(1, (gamma / 90) * 0.5 + 0.5)),
          y: Math.max(0, Math.min(1, ((beta - 45) / 90) * 0.5 + 0.5)),
        };
      };

      const addGyro = () => {
        window.addEventListener("deviceorientation", onOrientation, { passive: true });
        gyroCleanup = () => {
          window.removeEventListener("deviceorientation", onOrientation);
          window.removeEventListener("touchmove", onTouch);
        };
      };

      // iOS 13+ requires a user-gesture permission request
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        window.addEventListener("touchstart", () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (DeviceOrientationEvent as any).requestPermission()
            .then((state: string) => { if (state === "granted") addGyro(); })
            .catch(() => {});
        }, { once: true });
      } else {
        addGyro();
      }
    } else {
      // Desktop: mouse-reactive
      const onMouse = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
      };
      window.addEventListener("mousemove", onMouse, { passive: true });
      gyroCleanup = () => window.removeEventListener("mousemove", onMouse);
    }

    // After hero text settles: nudge amplitude up, then ease back
    const nudgeTimer1 = setTimeout(() => {
      nudgeTargetRef.current = 0.22;
      const nudgeTimer2 = setTimeout(() => { nudgeTargetRef.current = 0; }, 1400);
      return () => clearTimeout(nudgeTimer2);
    }, 3200);

    const draw = () => {
      t += 0.01;
      nudgeAmpRef.current = lerp(nudgeAmpRef.current, nudgeTargetRef.current, 0.035);
      // B: mobile gets 3× larger idle amplitude for flowing wave effect
      const amp = (isMobile ? 0.18 : 0.09) + nudgeAmpRef.current;
      ctx.clearRect(0, 0, W, H);

      for (const b of blobs) {
        const idleX = b.x + Math.sin(t * b.speedX * 1000 + b.phase) * amp;
        const idleY = b.y + Math.cos(t * b.speedY * 1000 + b.phase) * amp;
        const targetX = idleX + (mouseRef.current.x - 0.5) * b.depth;
        const targetY = idleY + (mouseRef.current.y - 0.5) * b.depth + scrollRef.current * b.depth * 0.5;

        b.tx = lerp(b.tx, targetX, 0.018 + b.depth * 0.04);
        b.ty = lerp(b.ty, targetY, 0.018 + b.depth * 0.04);

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
      clearTimeout(nudgeTimer1);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      gyroCleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${contained ? "absolute" : "fixed"} inset-0 pointer-events-none`}
      style={{ zIndex: 0, willChange: "transform" }}
    />
  );
}
