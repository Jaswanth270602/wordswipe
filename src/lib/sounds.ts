"use client";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.08
) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(audio.destination);
  const now = audio.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

export const sounds = {
  tap: () => tone(520, 0.06, "triangle", 0.06),
  scratch: () => tone(180, 0.12, "sawtooth", 0.04),
  reveal: () => {
    tone(440, 0.08, "sine", 0.07);
    setTimeout(() => tone(660, 0.1, "sine", 0.06), 70);
  },
  rate: (kind: "EASY" | "SOMEWHAT" | "HARD" | "NEW") => {
    if (kind === "EASY") {
      tone(523, 0.08);
      setTimeout(() => tone(659, 0.1), 60);
      setTimeout(() => tone(784, 0.12), 120);
    } else if (kind === "SOMEWHAT") {
      tone(440, 0.1);
      setTimeout(() => tone(554, 0.1), 80);
    } else if (kind === "HARD") {
      tone(330, 0.12, "triangle");
    } else {
      tone(220, 0.15, "square", 0.05);
    }
  },
  speak: (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.lang = "en-IN";
    window.speechSynthesis.speak(u);
  },
};
