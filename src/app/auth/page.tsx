"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BATCH_OPTIONS } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { unlockAudio } from "@/lib/sounds";
import { Suspense } from "react";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") === "signin" ? "signin" : "signup";
  const signIn = useAppStore((s) => s.signIn);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [batch, setBatch] = useState<string>(BATCH_OPTIONS[0]);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    unlockAudio();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!batch) {
      setError("Select your batch");
      return;
    }
    signIn({ name, phone: digits.slice(-10), batch });
    router.replace("/home");
  };

  return (
    <div className="mx-auto max-w-md space-y-6 pb-10 pt-4">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400">
        ← Back
      </Link>

      <div className="rounded-[28px] border border-white/10 bg-[#111827] p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
          {mode === "signin" ? "Sign in" : "Sign up"} to WordSwipe
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Phone + name + batch. Progress saves on this device (cloud sync later).
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-400/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">
              Phone number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="10-digit mobile"
              className="mt-1.5 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-teal-400/50"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Batch</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="mt-1.5 h-12 w-full rounded-2xl border border-white/10 bg-[#0b1220] px-4 text-sm text-white outline-none focus:border-teal-400/50"
            >
              {BATCH_OPTIONS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}

          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-teal-400 text-sm font-bold text-[#070b14] transition active:scale-[0.99]"
          >
            {mode === "signin" ? "Sign in & continue" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <Link href="/auth" className="text-teal-300">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already joined?{" "}
              <Link href="/auth?mode=signin" className="text-teal-300">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-slate-400">Loading…</div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
