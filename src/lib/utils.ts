import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function strengthBar(strength: number): string {
  const filled = Math.round(strength / 10);
  return "█".repeat(filled) + "░".repeat(10 - filled);
}

export function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short" });
}
