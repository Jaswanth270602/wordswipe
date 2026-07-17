"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { STUDY_SECTIONS } from "@/lib/sections";
import { unlockAudio } from "@/lib/sounds";
import { cn } from "@/lib/utils";

/** Circular spin navbar — drag to rotate, tap center hub to open */
export function CircularSectionSpin({ className }: { className?: string }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const rotation = useMotionValue(0);
  const counter = useTransform(rotation, (r) => -r);
  const startRot = useRef(0);
  const n = STUDY_SECTIONS.length;
  const step = 360 / n;
  const active = STUDY_SECTIONS[index];

  const snapTo = (i: number) => {
    const next = ((i % n) + n) % n;
    setIndex(next);
    animate(rotation, -next * step, {
      type: "spring",
      stiffness: 280,
      damping: 30,
    });
  };

  const onDragStart = () => {
    startRot.current = rotation.get();
  };

  const onDrag = (_: unknown, info: PanInfo) => {
    rotation.set(startRot.current + info.offset.x * 0.6);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const ang = rotation.get() + info.velocity.x * 0.035;
    let i = Math.round(-ang / step);
    i = ((i % n) + n) % n;
    snapTo(i);
  };

  const nodes = useMemo(
    () =>
      STUDY_SECTIONS.map((s, i) => {
        const angle = (i * step - 90) * (Math.PI / 180);
        const r = 108;
        return {
          ...s,
          i,
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
        };
      }),
    [n, step]
  );

  return (
    <div className={cn("relative mx-auto w-full max-w-sm", className)}>
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--teal)]">
        Spin · pick a section
      </p>

      <div className="relative mx-auto aspect-square w-[280px] select-none">
        <div className="absolute inset-3 rounded-full border border-[var(--stroke)] bg-[var(--card)] shadow-[var(--shadow-card)]" />
        <div className="pointer-events-none absolute inset-[18px] rounded-full border border-dashed border-[var(--stroke)] opacity-60" />

        <motion.div
          className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
          style={{ rotate: rotation }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.04}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          {nodes.map((node) => {
            const isActive = node.i === index;
            return (
              <motion.button
                key={node.key}
                type="button"
                onClick={() => {
                  unlockAudio();
                  snapTo(node.i);
                }}
                className="absolute flex h-11 w-11 flex-col items-center justify-center rounded-full border text-[10px] font-bold"
                style={{
                  left: `calc(50% + ${node.x}px)`,
                  top: `calc(50% + ${node.y}px)`,
                  x: "-50%",
                  y: "-50%",
                  rotate: counter,
                  background: isActive ? node.color : "var(--surface)",
                  color: isActive ? "#070b14" : "var(--ink)",
                  borderColor: isActive ? node.color : "var(--stroke)",
                  boxShadow: isActive ? `0 0 22px ${node.color}55` : undefined,
                  zIndex: isActive ? 5 : 1,
                }}
              >
                {node.short}
              </motion.button>
            );
          })}
        </motion.div>

        <button
          type="button"
          onClick={() => {
            unlockAudio();
            router.push(active.href);
          }}
          className="absolute left-1/2 top-1/2 z-10 flex h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--bg-elevated)] px-3 text-center transition active:scale-95"
          style={{ boxShadow: `inset 0 0 0 2px ${active.color}66` }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: active.color }}
          >
            Open
          </span>
          <span className="mt-0.5 font-[family-name:var(--font-display)] text-sm leading-tight text-[var(--ink)]">
            {active.label}
          </span>
          <span className="mt-1 text-[10px] text-[var(--muted)]">
            {active.hint}
          </span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => snapTo(index - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--card)] text-lg text-[var(--ink)]"
        >
          ‹
        </button>
        <p className="min-w-[7rem] text-center text-xs text-[var(--muted)]">
          {index + 1} / {n} · {active.short}
        </p>
        <button
          type="button"
          aria-label="Next"
          onClick={() => snapTo(index + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--card)] text-lg text-[var(--ink)]"
        >
          ›
        </button>
      </div>
    </div>
  );
}
