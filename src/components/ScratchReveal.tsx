"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sounds } from "@/lib/sounds";
import { cn } from "@/lib/utils";

interface ScratchRevealProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  onReveal?: () => void;
}

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

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0d5c56");
    grad.addColorStop(0.45, "#0f766e");
    grad.addColorStop(1, "#115e59");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    for (let i = -h; i < w + h; i += 9) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "600 15px Figtree, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, w / 2, h / 2 - 8);
    ctx.font = "500 12px Figtree, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillText("Drag to scratch", w / 2, h / 2 + 14);

    setFoilReady(true);
    return true;
  }, [label]);

  useEffect(() => {
    if (revealed) return;
    const container = containerRef.current;
    if (!container) return;

    const run = () => {
      paintFoil();
    };

    run();
    const raf = requestAnimationFrame(run);
    const t1 = window.setTimeout(run, 40);
    const t2 = window.setTimeout(run, 160);

    const ro = new ResizeObserver(() => {
      // Repaint full foil only before the user has started scratching
      if (scratched.current === 0) paintFoil();
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
    };
  }, [paintFoil, revealed]);

  const finishReveal = () => {
    if (revealFired.current) return;
    revealFired.current = true;
    setRevealed(true);
    sounds.reveal();
    onReveal?.();
  };

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    const radius = 30 * Math.max(scaleX, scaleY);

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    scratched.current += 1;
    if (scratched.current % 4 === 0) sounds.scratch();

    if (scratched.current > 10) {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0;
      let total = 0;
      for (let i = 3; i < image.data.length; i += 32) {
        total++;
        if (image.data[i] < 120) clear++;
      }
      if (total > 0 && clear / total > 0.38) finishReveal();
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl",
        className
      )}
    >
      <div className="p-4">{children}</div>

      {!revealed && (
        <>
          {/* Covers content until canvas bitmap is painted full-size */}
          {!foilReady && (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-[#0f766e]"
              aria-hidden
            >
              <span className="text-sm font-semibold text-white/90">{label}</span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-20 m-0 block h-full max-h-none w-full max-w-none touch-none cursor-crosshair rounded-[inherit] p-0"
            style={{ width: "100%", height: "100%" }}
            onPointerDown={(e) => {
              drawing.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratchAt(e.clientX, e.clientY);
              sounds.tap();
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return;
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              drawing.current = false;
            }}
            onPointerCancel={() => {
              drawing.current = false;
            }}
          />
        </>
      )}
    </div>
  );
}
