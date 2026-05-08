"use client";

import { useState, useEffect, useRef } from "react";
import InputForm from "@/components/InputForm";
import LoadingState from "@/components/LoadingState";
import { TripFormData } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const img = heroRef.current.querySelector(".parallax-slow") as HTMLElement;
        if (img) {
          img.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
        }
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

  return (
    <main className="min-h-dvh grain">
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-flamingo/5 blur-[100px] float-orb" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-sunset/5 blur-[120px] float-orb" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Hero with parallax background */}
      <div ref={heroRef} className="relative h-[75vh] min-h-[550px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center parallax-slow scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-midnight/60 to-midnight" />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-12 max-w-md mx-auto hero-text-reveal">
          <p className="font-condensed text-[13px] font-medium uppercase tracking-[0.2em] text-flamingo/80 mb-5">
            Built with Claude × HUVA
          </p>
          <h1 className="font-display text-[72px] leading-[0.88] tracking-[-0.03em] text-canvas">
            Travel
            <br />
            <span className="text-flamingo">Vibe</span>
            <br />
            Generator.
          </h1>
          <p className="font-serif text-[20px] text-canvas/60 mt-5 leading-[1.3] italic">
            Tell me where. I&apos;ll handle the rest.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="font-condensed text-[10px] uppercase tracking-[0.2em] text-canvas/30">Scroll</span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-canvas/30 to-transparent" />
        </div>
      </div>

      {/* Form section */}
      <div className="relative z-10 px-6 pt-14 pb-36 max-w-md mx-auto">
        {error && (
          <div className="mb-8 py-4 px-4 border border-sunset/30 bg-sunset/5 text-sunset font-condensed text-[14px] reveal visible">
            {error}
          </div>
        )}
        <InputForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
