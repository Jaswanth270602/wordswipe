"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScratchRevealProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  onReveal?: () => void;
}

/**
 * Smooth mobile scratch — draws continuous strokes in canvas pixel space.
 * No sound. Full-bleed foil with ResizeObserver.
 */
export function ScratchReveal({
  children,
  label = "Scratch to reveal",
  className,
  onReveal,
}: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [foilReady, setFoilReady] = useState(false);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const scratched = useRef(0);
  const revealFired = useRef(false);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || revealFired.current) return false;

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w < 4 || h < 4) return false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bw = Math.max(1, Math.floor(w * dpr));
    const bh = Math.max(1, Math.floor(h * dpr));
    canvas.width = bw;
    canvas.height = bh;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return false;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0f766e");
    grad.addColorStop(0.5, "#14b8a6");
    grad.addColorStop(1, "#0d9488");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    for (let i = -h; i < w + h; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "600 15px Figtree, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, w / 2, h / 2 - 10);
    ctx.font = "500 12px Figtree, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("Drag your finger", w / 2, h / 2 + 12);

    setFoilReady(true);
    return true;
  }, [label]);

  useEffect(() => {
    if (revealed) return;
    const container = containerRef.current;
    if (!container) return;

    const run = () => paintFoil();
    run();
    const raf = requestAnimationFrame(run);
    const t = window.setTimeout(run, 80);

    const ro = new ResizeObserver(() => {
      if (scratched.current === 0) paintFoil();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [paintFoil, revealed]);

  const toCanvasXY = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
      brush: Math.max(28, 34 * (canvas.width / rect.width)),
    };
  };

  const eraseAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const pt = toCanvasXY(clientX, clientY);
    if (!ctx || !pt) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = pt.brush;
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";

    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.brush / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    last.current = { x: pt.x, y: pt.y };
    scratched.current += 1;

    if (scratched.current > 8 && scratched.current % 4 === 0) {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0;
      let total = 0;
      for (let i = 3; i < image.data.length; i += 48) {
        total++;
        if (image.data[i] < 128) clear++;
      }
      if (total > 0 && clear / total > 0.36) {
        if (!revealFired.current) {
          revealFired.current = true;
          setRevealed(true);
          onReveal?.();
        }
      }
    }
  };

  const onStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    drawing.current = true;
    last.current = null;
    e.currentTarget.setPointerCapture(e.pointerId);
    eraseAt(e.clientX, e.clientY);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    eraseAt(e.clientX, e.clientY);
  };

  const onEnd = () => {
    drawing.current = false;
    last.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative isolate overflow-hidden rounded-2xl", className)}
    >
      <div className="p-4">{children}</div>

      {!revealed && (
        <>
          {!foilReady && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center bg-teal-700"
              aria-hidden
            >
              <span className="text-sm font-semibold text-white/90">{label}</span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 block h-full w-full touch-none select-none"
            style={{
              width: "100%",
              height: "100%",
              touchAction: "none",
            }}
            onPointerDown={onStart}
            onPointerMove={onMove}
            onPointerUp={onEnd}
            onPointerCancel={onEnd}
            onPointerLeave={onEnd}
          />
        </>
      )}
    </div>
  );
}
