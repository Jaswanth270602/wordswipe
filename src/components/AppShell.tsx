import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { StoreHydrator } from "@/components/StoreHydrator";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <StoreHydrator />
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[var(--blob-a)] blur-3xl" />
        <div className="absolute -right-16 top-40 h-64 w-64 rounded-full bg-[var(--blob-b)] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[var(--blob-c)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15,61,46,0.08) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>
      <Navbar />
      <main className="mx-auto w-full max-w-lg px-4 pb-28 pt-5">{children}</main>
      <BottomNav />
    </div>
  );
}
