"use client";

/** Production-safe audio + pronunciation helpers */

let unlocked = false;

export function unlockAudio() {
  if (typeof window === "undefined") return;
  unlocked = true;
  try {
    if (window.speechSynthesis) {
      // iOS / Chrome need a gesture-bound unlock
      window.speechSynthesis.cancel();
      const warm = new SpeechSynthesisUtterance("");
      warm.volume = 0;
      window.speechSynthesis.speak(warm);
    }
  } catch {
    /* ignore */
  }
}

export const sounds = {
  tap: () => {
    /* silent UI — no click noise */
  },
  scratch: () => {
    /* silent scratch by design */
  },
  reveal: () => {
    /* silent reveal */
  },
  rate: (_kind: "EASY" | "SOMEWHAT" | "HARD" | "NEW") => {
    /* silent swipe */
  },
  speak: (text: string) => {
    if (typeof window === "undefined") return;
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis unavailable");
      return;
    }
    unlockAudio();
    const speakNow = () => {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      u.pitch = 1;
      u.volume = 1;
      // Prefer Indian English, then any en
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /en-IN/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang) && /female|natural|google/i.test(v.name)) ||
        voices.find((v) => /^en/i.test(v.lang));
      if (preferred) u.voice = preferred;
      u.lang = preferred?.lang || "en-IN";
      window.speechSynthesis.speak(u);
    };
    // Voices often load async in production
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        speakNow();
        window.speechSynthesis.onvoiceschanged = null;
      };
      // Fallback if event never fires
      setTimeout(speakNow, 150);
    } else {
      speakNow();
    }
  },
};
