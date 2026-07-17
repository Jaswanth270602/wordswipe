import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WordSwipe — SSC CGL English",
  description:
    "Tinder-style spaced repetition for SSC CGL vocabulary. Scratch, swipe, remember.",
  applicationName: "WordSwipe",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070b14",
};

const themeInit = `(function(){try{var t=localStorage.getItem('wordswipe-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. crxlauncher) mutate <html>/<body>
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full`}
      suppressHydrationWarning
      data-theme="dark"
    >
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <Script id="wordswipe-theme" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
