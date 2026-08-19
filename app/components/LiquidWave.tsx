"use client";

import { useEffect, useRef } from "react";

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  waveIntensity?:  number;                    // 0–1, disturbance strength
  viscosity?:      number;                    // 0–1, damping (higher = longer waves)
  baseColor?:      [number, number, number];  // RGB 0–1
  highlightColor?: [number, number, number];
  shadowColor?:    [number, number, number];
}

// ── Vertex shader (shared) ────────────────────────────────────────────────────
const VERT = `
  attribute vec2 a_pos;
  varying   vec2 v_uv;
  void main() {
    v_uv        = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

// ── Wave simulation shader ────────────────────────────────────────────────────
// Classic height-field: next = (N+S+E+W)/2 − prev, then damp
const SIM_FRAG = `
  precision highp float;
  uniform sampler2D u_curr;
  uniform sampler2D u_prev;
  uniform vec2      u_res;
  uniform vec2      u_mouse;
  uniform float     u_active;
  uniform float     u_speed;
  uniform float     u_intensity;
  uniform float     u_damp;
  varying vec2      v_uv;

  float dec(sampler2D t, vec2 uv) { return texture2D(t, uv).r * 2.0 - 1.0; }

  void main() {
    vec2  px  = 1.0 / u_res;
    float c   = dec(u_curr, v_uv);
    float n   = dec(u_curr, v_uv + vec2(0.0,  px.y));
    float s   = dec(u_curr, v_uv - vec2(0.0,  px.y));
    float e   = dec(u_curr, v_uv + vec2(px.x, 0.0));
    float w   = dec(u_curr, v_uv - vec2(px.x, 0.0));
    float p   = dec(u_prev, v_uv);

    // Wave equation with damping (viscosity)
    float next = ((n + s + e + w) * 0.5 - p) * u_damp;

    // Speed-scaled Gaussian disturbance at cursor (aspect-corrected)
    vec2  d    = v_uv - u_mouse;
    d.x       *= u_res.x / u_res.y;
    float gauss = exp(-dot(d, d) / 0.0012);
    float force = u_active * (0.15 + u_speed * 0.85) * u_intensity * gauss * 0.65;
    next       -= force;

    gl_FragColor = vec4(clamp(next * 0.5 + 0.5, 0.0, 1.0), 0.0, 0.0, 1.0);
  }
`;

// ── Render / lighting shader ──────────────────────────────────────────────────
// Normal-map from height field → Blinn-Phong → milk palette
const RENDER_FRAG = `
  precision highp float;
  uniform sampler2D u_height;
  uniform vec2      u_simRes;
  uniform vec3      u_base;
  uniform vec3      u_hi;
  uniform vec3      u_lo;
  varying vec2      v_uv;

  float dec(vec2 uv) { return texture2D(u_height, uv).r * 2.0 - 1.0; }

  void main() {
    vec2 px = 1.0 / u_simRes;

    // Finite-difference surface normal
    float hL = dec(v_uv - vec2(px.x, 0.0));
    float hR = dec(v_uv + vec2(px.x, 0.0));
    float hD = dec(v_uv - vec2(0.0,  px.y));
    float hU = dec(v_uv + vec2(0.0,  px.y));
    float hC = dec(v_uv);

    vec3 norm = normalize(vec3((hL - hR) * 6.0, (hD - hU) * 6.0, 1.0));

    // Soft overhead light — warm, slightly off-axis (like a ceiling lamp)
    vec3 L = normalize(vec3(-0.2, 0.45, 1.0));
    float diff = clamp(dot(norm, L), 0.0, 1.0);

    // Creamy specular — broad, low-gloss (shininess 16 = matte cream)
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 H = normalize(L + V);
    float spec = pow(clamp(dot(norm, H), 0.0, 1.0), 16.0);

    // Faint rim glow at wave crests (warm edge light)
    float crest = clamp(hC * 3.5, 0.0, 1.0);
    float rim   = (1.0 - abs(norm.z)) * crest * 0.07;

    // Caustic-like secondary highlight: a narrower specular lobe on peaks
    float caustic = pow(clamp(dot(norm, H), 0.0, 1.0), 48.0) * crest * 0.3;

    vec3 col = mix(u_lo, u_base, smoothstep(0.15, 0.95, diff));
    col      = mix(col, u_hi, spec * 0.45 + caustic);
    col     += u_hi * rim;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function LiquidWave({
  waveIntensity  = 0.82,
  viscosity      = 0.985,
  baseColor      = [1.000, 1.000, 1.000] as [number,number,number],   // #FFFFFF
  highlightColor = [1.000, 1.000, 1.000] as [number,number,number],   // pure white crest
  shadowColor    = [0.880, 0.876, 0.872] as [number,number,number],   // soft warm grey — visible depth without harsh contrast
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
    if (!gl) return;

    // ── GL helpers ─────────────────────────────────────────────────────────
    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    function mkProgram(vs: string, fs: string) {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, mkShader(gl!.VERTEX_SHADER, vs));
      gl!.attachShader(p, mkShader(gl!.FRAGMENT_SHADER, fs));
      gl!.linkProgram(p);
      return p;
    }
    function mkTex(w: number, h: number, fill: number = 128) {
      const data = new Uint8Array(w * h * 4);
      for (let i = 0; i < data.length; i += 4) { data[i] = fill; data[i+3] = 255; }
      const t = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, data);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      return t;
    }
    function mkFB(tex: WebGLTexture) {
      const fb = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fb);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      return fb;
    }

    // ── Programs ───────────────────────────────────────────────────────────
    const simProg = mkProgram(VERT, SIM_FRAG);
    const renProg = mkProgram(VERT, RENDER_FRAG);

    // Cache uniform locations (avoids per-frame string lookups)
    const simU = {
      curr:      gl.getUniformLocation(simProg, "u_curr"),
      prev:      gl.getUniformLocation(simProg, "u_prev"),
      res:       gl.getUniformLocation(simProg, "u_res"),
      mouse:     gl.getUniformLocation(simProg, "u_mouse"),
      active:    gl.getUniformLocation(simProg, "u_active"),
      speed:     gl.getUniformLocation(simProg, "u_speed"),
      intensity: gl.getUniformLocation(simProg, "u_intensity"),
      damp:      gl.getUniformLocation(simProg, "u_damp"),
    };
    const renU = {
      height: gl.getUniformLocation(renProg, "u_height"),
      simRes: gl.getUniformLocation(renProg, "u_simRes"),
      base:   gl.getUniformLocation(renProg, "u_base"),
      hi:     gl.getUniformLocation(renProg, "u_hi"),
      lo:     gl.getUniformLocation(renProg, "u_lo"),
    };

    // ── Full-screen quad ───────────────────────────────────────────────────
    const quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    function bindQuad(prog: WebGLProgram) {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
      const loc = gl!.getAttribLocation(prog, "a_pos");
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, 2, gl!.FLOAT, false, 0, 0);
    }

    // ── Ping-pong textures/framebuffers ────────────────────────────────────
    // We keep three: curr (t), prev (t-1), next (write target)
    const SIM_W = 512;
    let SIM_H = 320;
    let W = 0, H = 0, DPR = 1;

    let texCurr = mkTex(SIM_W, SIM_H);
    let texPrev = mkTex(SIM_W, SIM_H);
    let texNext = mkTex(SIM_W, SIM_H);
    let fbCurr  = mkFB(texCurr);
    let fbPrev  = mkFB(texPrev);
    let fbNext  = mkFB(texNext);

    const resize = () => {
      DPR = window.devicePixelRatio || 1;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W * DPR;
      canvas.height = H * DPR;
      SIM_H = Math.round(SIM_W * (H / W));

      // Rebuild sim textures at new aspect ratio
      [texCurr, texPrev, texNext].forEach(t => gl!.deleteTexture(t));
      [fbCurr, fbPrev, fbNext].forEach(f => gl!.deleteFramebuffer(f));

      texCurr = mkTex(SIM_W, SIM_H); fbCurr = mkFB(texCurr);
      texPrev = mkTex(SIM_W, SIM_H); fbPrev = mkFB(texPrev);
      texNext = mkTex(SIM_W, SIM_H); fbNext = mkFB(texNext);
    };

    resize();
    window.addEventListener("resize", resize);

    // ── Mouse ──────────────────────────────────────────────────────────────
    const mouse = { x: 0.5, y: 0.5, active: 0, speed: 0 };
    let lastMx = -1, lastMy = -1, lastT = 0;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Only active while cursor is over the canvas
      if (
        e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top  || e.clientY > rect.bottom
      ) {
        mouse.active = 0;
        return;
      }

      const mx = (e.clientX - rect.left) / W;
      const my = 1.0 - (e.clientY - rect.top) / H; // flip Y for WebGL

      const now = performance.now();
      const dt  = Math.max(8, now - lastT);

      if (lastMx >= 0) {
        const dx = mx - lastMx, dy = my - lastMy;
        const uvSpeed = Math.hypot(dx, dy) / (dt / 1000);
        mouse.speed = Math.min(1.0, uvSpeed / 1.8);
      }

      mouse.x      = mx;
      mouse.y      = my;
      mouse.active = 1;
      lastMx = mx; lastMy = my; lastT = now;
    };

    const onLeave = () => { mouse.active = 0; mouse.speed = 0; lastMx = -1; };
    // Listen on window so pointer-events:none on the wrapper doesn't block us
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    // ── Auto-disturb: sweeps after hero text settles (~3.2s) ──────────────
    const auto = { x: 0.5, y: 0.5, active: 0, speed: 0 };

    const autoTimer = setTimeout(() => {
      const startT  = performance.now();
      const duration = 2200;

      const sweep = () => {
        const p   = Math.min((performance.now() - startT) / duration, 1);
        // Curved path: start upper-left of text, arc through center, exit lower-right
        auto.x     = 0.18 + p * 0.64;
        auto.y     = 0.55 + Math.sin(p * Math.PI) * 0.22;
        auto.speed = Math.sin(p * Math.PI) * 0.7;   // ramp up then down
        auto.active = p < 1 ? 1 : 0;
        if (p < 1) requestAnimationFrame(sweep);
        else auto.active = 0;
      };
      requestAnimationFrame(sweep);
    }, 3200);

    // ── Gyroscope (mobile) ─────────────────────────────────────────────────
    // Maps device tilt to a virtual cursor that stirs the liquid
    const gyro = { x: 0.5, y: 0.5, active: 0, speed: 0 };
    let lastGamma = 0, lastBeta = 0, gyroReady = false;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;

      // gamma: left/right tilt (−90→90), beta: front/back tilt (−180→180)
      // Clamp to a comfortable ±40° range
      const gamma = Math.max(-40, Math.min(40, e.gamma));
      const beta  = Math.max(-40, Math.min(40, (e.beta ?? 0) - 45));

      const x = (gamma + 40) / 80;
      const y = 1 - (beta  + 40) / 80; // flip Y for WebGL

      const dg = e.gamma - lastGamma;
      const db = (e.beta ?? 0) - lastBeta;
      gyro.speed  = Math.min(1, Math.hypot(dg, db) / 8);
      gyro.x      = x;
      gyro.y      = y;
      gyro.active = 1;

      lastGamma = e.gamma;
      lastBeta  = e.beta ?? 0;
    };

    const startGyro = () => {
      if (gyroReady) return;
      gyroReady = true;
      // iOS 13+ requires explicit permission
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DOE = DeviceOrientationEvent as any;
      if (typeof DOE.requestPermission === "function") {
        DOE.requestPermission()
          .then((res: string) => {
            if (res === "granted") window.addEventListener("deviceorientation", onOrientation);
          })
          .catch(() => {});
      } else {
        window.addEventListener("deviceorientation", onOrientation);
      }
    };

    // Register the touchstart listener that will trigger the permission prompt.
    // On iOS we defer until after the intro animation exits — showing a permission
    // dialog mid-animation is confusing and users tend to dismiss it.
    const registerGyroListener = () => {
      window.addEventListener("touchstart", startGyro, { once: true });
    };

    // Non-iOS: no permission dialog, add deviceorientation directly so gyro
    // works without requiring the user to touch the screen first.
    const DOEForCheck = DeviceOrientationEvent as any;
    if (typeof DOEForCheck.requestPermission !== "function") {
      // Android / desktop — listener already added inside startGyro's else branch,
      // but startGyro won't fire without a touch. Call it immediately instead.
      if (!gyroReady) {
        gyroReady = true;
        window.addEventListener("deviceorientation", onOrientation);
      }
    } else if (sessionStorage.getItem("milk:intro-shown")) {
      // iOS, intro already played this session — request on next touch
      registerGyroListener();
    } else {
      // iOS, first visit — wait for intro to finish before prompting
      window.addEventListener("milk:intro-exit", registerGyroListener, { once: true } as EventListenerOptions);
    }

    // ── Render loop ────────────────────────────────────────────────────────
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);

      // ── Simulation pass: read curr+prev → write next ─────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbNext);
      gl.viewport(0, 0, SIM_W, SIM_H);
      gl.useProgram(simProg);
      bindQuad(simProg);

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texCurr);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texPrev);
      gl.uniform1i(simU.curr, 0);
      gl.uniform1i(simU.prev, 1);
      gl.uniform2f(simU.res,       SIM_W, SIM_H);
      // Auto-sweep takes priority, then real mouse, then gyro
      const input = auto.active ? auto : mouse.active ? mouse : gyro;
      gl.uniform2f(simU.mouse,     input.x, input.y);
      gl.uniform1f(simU.active,    input.active);
      gl.uniform1f(simU.speed,     input.speed);
      gl.uniform1f(simU.intensity, waveIntensity);
      gl.uniform1f(simU.damp,      viscosity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // ── Render pass: next → screen ────────────────────────────────────
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W * DPR, H * DPR);
      gl.useProgram(renProg);
      bindQuad(renProg);

      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texNext);
      gl.uniform1i(renU.height, 0);
      gl.uniform2f(renU.simRes, SIM_W, SIM_H);
      gl.uniform3fv(renU.base,  baseColor);
      gl.uniform3fv(renU.hi,    highlightColor);
      gl.uniform3fv(renU.lo,    shadowColor);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // ── Rotate buffers: next→curr, curr→prev, prev→next (free) ───────
      [texCurr, texPrev, texNext] = [texNext, texCurr, texPrev];
      [fbCurr,  fbPrev,  fbNext]  = [fbNext,  fbCurr,  fbPrev];
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(autoTimer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("touchstart", startGyro);
      window.removeEventListener("milk:intro-exit", registerGyroListener as EventListener);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(quadBuf);
      gl.deleteProgram(simProg);
      gl.deleteProgram(renProg);
    };
  // Props are read inside the loop via closure — stable refs, no re-mount needed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
