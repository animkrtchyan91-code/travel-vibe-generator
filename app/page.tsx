"use client";

import { useState, useEffect, useRef } from "react";
import InputForm from "@/components/InputForm";
import LoadingState from "@/components/LoadingState";
import Marquee from "@/components/Marquee";
import CursorSpotlight from "@/components/CursorSpotlight";
import { Sparkle, Star, Burst, Squiggle, Plus } from "@/components/Decorations";
import { TripFormData } from "@/lib/types";

const TODAY = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase();

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const img = heroRef.current.querySelector(".parallax-slow") as HTMLElement;
        if (img) img.style.transform = `translateY(${scrollY * 0.3}px) scale(1.15)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (data: TripFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }
      const { id } = await res.json();
      window.location.href = `/trip?id=${id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (loading) return <LoadingState />;

  const titleLetters = "TRAVEL".split("");
  const subLetters = "VIBE".split("");

  return (
    <main className="min-h-dvh grain relative">
      <CursorSpotlight />

      {/* === TOP TICKER === */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-canvas text-midnight border-b border-midnight">
        <Marquee speed="normal" separator="✶" separatorClassName="text-sunset">
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase">Built with Claude × HUVA</span>
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase">Issue №01 — {TODAY}</span>
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase">Hyper-specific. Verified. Yours.</span>
          <span className="font-mono text-[11px] tracking-[0.15em] uppercase">From dreaming to itinerary in 60 seconds</span>
        </Marquee>
      </div>

      {/* === FLOATING ORBS === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 -right-40 w-[500px] h-[500px] rounded-full bg-flamingo/8 blur-[120px] float-orb" />
        <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] rounded-full bg-sunset/8 blur-[140px] float-orb" style={{ animationDelay: "-3s" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-goldenrod/6 blur-[100px] float-orb" style={{ animationDelay: "-5s" }} />
      </div>

      {/* === HERO === */}
      <section ref={heroRef} className="relative min-h-[88dvh] pt-[34px] overflow-hidden">
        {/* Bg image */}
        <div
          className="absolute inset-0 bg-cover bg-center parallax-slow scale-115"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/60 via-midnight/50 to-midnight" />

        {/* Decorative elements */}
        <div className="absolute top-[80px] right-6 z-10 spin-slow">
          <Burst color="var(--color-flamingo)" size={48} />
        </div>
        <div className="absolute top-[120px] left-8 z-10">
          <Star size={20} color="var(--color-goldenrod)" />
        </div>
        <div className="absolute top-[200px] right-12 z-10 sticker-tilt-r">
          <div className="border border-canvas/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/70 bg-midnight/40 backdrop-blur-sm">
            ⌖ Vol.01
          </div>
        </div>

        <div className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-20 flex flex-col h-full justify-end min-h-[calc(88dvh-34px)]">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-sunset blink" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-canvas/70">
              Now generating
            </span>
            <Squiggle className="w-10 h-3 ml-1" color="var(--color-flamingo)" />
          </div>

          {/* Title — letter-by-letter */}
          <h1 className="font-display text-[68px] leading-[0.86] tracking-[-0.04em] text-canvas">
            <span className="block letter-rise">
              {titleLetters.map((c, i) => (
                <span key={i} style={{ animationDelay: `${i * 70}ms` }}>{c}</span>
              ))}
            </span>
            <span className="block italic text-flamingo letter-rise -mt-2 ml-6">
              {subLetters.map((c, i) => (
                <span key={i} style={{ animationDelay: `${500 + i * 70}ms` }}>{c}</span>
              ))}
            </span>
            <span className="block text-outline-stroke mt-1 text-[58px]">Generator.</span>
          </h1>

          {/* Tagline */}
          <p className="font-serif italic text-[19px] leading-[1.2] text-canvas/75 mt-6 max-w-sm">
            Tell me <span className="hand-underline text-flamingo not-italic font-mono text-[14px] uppercase tracking-wider">where</span> — and I&apos;ll build a trip you&apos;ll actually take.
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-8 font-mono text-[9px] uppercase tracking-[0.2em] text-canvas/40">
            <span className="flex items-center gap-1.5">
              <Plus size={10} /> Verified spots
            </span>
            <span className="w-px h-3 bg-canvas/20" />
            <span className="flex items-center gap-1.5">
              <Plus size={10} /> Real prices
            </span>
            <span className="w-px h-3 bg-canvas/20" />
            <span className="flex items-center gap-1.5">
              <Plus size={10} /> Day-by-day
            </span>
          </div>

        </div>
      </section>

      {/* === DIVIDER MARQUEE === */}
      <div className="relative z-10 bg-flamingo text-midnight py-3 border-y border-midnight overflow-hidden">
        <Marquee speed="fast" separator="✦" separatorClassName="text-sunset">
          <span className="font-display italic text-[24px] leading-none">Compose your trip below</span>
          <span className="font-mono text-[14px] uppercase tracking-[0.2em]">Compose your trip below</span>
          <span className="font-display italic text-[24px] leading-none">Where to?</span>
          <span className="font-mono text-[14px] uppercase tracking-[0.2em]">Where to?</span>
        </Marquee>
      </div>

      {/* === FORM SECTION === */}
      <section className="relative z-10 px-6 pt-16 pb-40 max-w-md mx-auto">
        {/* Section label */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-flamingo">
              ✶ The brief
            </p>
            <h2 className="font-display text-[42px] leading-[0.95] tracking-[-0.025em] text-canvas mt-3">
              Tell me <span className="italic text-sunset">everything</span>.
            </h2>
            <p className="font-serif italic text-[16px] text-canvas/50 mt-3 leading-snug">
              The more specific you are, the better the trip. Promise.
            </p>
          </div>
          <Star size={28} color="var(--color-goldenrod)" className="shrink-0 mt-2 wiggle" />
        </div>

        {error && (
          <div className="mb-10 relative">
            <div className="border-2 border-sunset bg-sunset/5 px-4 py-3 sticker">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-sunset mb-1">⚠ Error</p>
              <p className="font-serif italic text-[14px] text-sunset/90">{error}</p>
            </div>
          </div>
        )}

        <InputForm onSubmit={handleSubmit} />
      </section>

      {/* === FOOTER MARQUEE === */}
      <div className="relative z-10 bg-canvas text-midnight border-t border-midnight py-2.5 overflow-hidden mb-20">
        <Marquee speed="slow" reverse separator="◆" separatorClassName="text-flamingo">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">@aiwithani × HUVA × Claude</span>
          <span className="font-display italic text-[18px]">Made for travelers, not tourists</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">© Travel Vibe Generator 2026</span>
        </Marquee>
      </div>
    </main>
  );
}
