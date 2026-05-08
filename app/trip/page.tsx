"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { TripPlan } from "@/lib/types";
import DayCard from "@/components/DayCard";
import ThemedList from "@/components/ThemedList";
import BudgetBadge from "@/components/BudgetBadge";
import TripMap from "@/components/TripMap";
import Marquee from "@/components/Marquee";
import CursorSpotlight from "@/components/CursorSpotlight";
import { Star, Burst, Sparkle, Squiggle } from "@/components/Decorations";
import { useMultiReveal } from "@/hooks/useScrollReveal";

const CITY_IMAGES: Record<string, string> = {
  lisbon: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1600&q=85",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&q=85",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=85",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&q=85",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&q=85",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&q=85",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1600&q=85",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=85",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&q=85",
  istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&q=85",
  "mexico city": "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1600&q=85",
  amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1600&q=85",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=85";

function cityImageUrl(city: string): string {
  return CITY_IMAGES[city.toLowerCase()] || DEFAULT_IMAGE;
}

function AnimatedCounter({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1400;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="counter-glow">
      {prefix}{displayed}
    </span>
  );
}

function TripContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const demo = searchParams.get("demo");
  const heroRef = useRef<HTMLDivElement>(null);

  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useMultiReveal(".reveal", [trip]);

  useEffect(() => {
    const url = demo === "1" ? "/api/trip?demo=1" : `/api/trip?id=${id}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Trip not found");
        return res.json();
      })
      .then(setTrip)
      .catch((err) => setError(err.message));
  }, [id, demo]);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const img = heroRef.current.querySelector(".parallax-slow") as HTMLElement;
        if (img) img.style.transform = `translateY(${scrollY * 0.4}px) scale(1.18)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 grain">
        <p className="text-sunset font-serif italic text-[18px] mb-6">{error}</p>
        <Link href="/" className="font-mono text-[12px] uppercase tracking-[0.15em] text-canvas border border-canvas/30 px-6 py-3 hover:bg-canvas hover:text-midnight transition-all btn-shine">
          ← Start over
        </Link>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-dvh flex items-center justify-center grain">
        <div className="w-3 h-3 bg-flamingo pulse-square" />
      </div>
    );
  }

  const cityUpper = trip.city.toUpperCase();
  const totalSpots =
    trip.days.reduce((sum, d) => sum + d.morning.length + d.afternoon.length + d.evening.length, 0);

  return (
    <div className="min-h-dvh grain relative">
      <CursorSpotlight />

      {/* === TOP NAV BAR === */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-canvas text-midnight border-b border-midnight">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.2em] hover:text-sunset transition-colors duration-300 flex items-center gap-1.5">
            ← Back
          </Link>
          <span className="font-display italic text-[16px] truncate">
            {trip.city}, {trip.month}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
            №01
          </span>
        </div>
      </div>

      {/* === FLOATING ORBS === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-flamingo/8 blur-[120px] float-orb" />
        <div className="absolute bottom-1/3 -left-32 w-[600px] h-[600px] rounded-full bg-goldenrod/6 blur-[140px] float-orb" style={{ animationDelay: "-4s" }} />
      </div>

      {/* === HERO === */}
      <section ref={heroRef} className="relative min-h-[80dvh] pt-[34px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center parallax-slow scale-115"
          style={{ backgroundImage: `url('${cityImageUrl(trip.city)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/55 to-midnight" />

        {/* Decorations */}
        <div className="absolute top-[60px] right-6 z-10 spin-slow">
          <Burst color="var(--color-flamingo)" size={56} />
        </div>
        <div className="absolute top-[140px] left-8 z-10">
          <Star size={24} color="var(--color-goldenrod)" />
        </div>

        {/* Sticker badge */}
        <div className="absolute top-[60px] left-6 z-10 sticker-tilt-l">
          <div className="border-2 border-flamingo bg-midnight/40 backdrop-blur-sm px-3 py-1.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-flamingo">
              ⌖ Verified · {trip.days.length}d
            </p>
          </div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-12 max-w-md mx-auto min-h-[calc(80dvh-34px)] hero-text-reveal">
          <div className="mb-3 flex items-center gap-2">
            <Sparkle size={14} color="var(--color-flamingo)" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-canvas/60">
              Your itinerary for
            </span>
          </div>

          <h1 className="font-display text-[100px] leading-[0.82] tracking-[-0.045em] text-canvas">
            {cityUpper.length > 8 ? (
              <span className="block text-[72px]">{cityUpper}</span>
            ) : (
              <span className="block">{cityUpper}</span>
            )}
          </h1>

          <p className="font-serif italic text-[19px] text-canvas/65 mt-6 leading-[1.35] max-w-sm">
            {trip.weather_note}
          </p>
        </div>
      </section>

      {/* === MARQUEE TICKER === */}
      <div className="relative z-10 bg-flamingo text-midnight border-y border-midnight py-3 overflow-hidden">
        <Marquee speed="normal" separator="✦" separatorClassName="text-sunset">
          <span className="font-display italic text-[24px] leading-none">{trip.days.length} days · {totalSpots} spots</span>
          <span className="font-mono text-[12px] uppercase tracking-[0.2em]">${trip.total_cost_estimate_usd} total</span>
          <span className="font-display italic text-[24px] leading-none">All verified</span>
          <span className="font-mono text-[12px] uppercase tracking-[0.2em]">Real prices · Real spots</span>
        </Marquee>
      </div>

      <main className="relative z-10 px-6 pt-12 pb-16 max-w-md mx-auto">
        {/* === ASYMMETRIC STAT GRID === */}
        <section className="mb-16 reveal">
          <div className="grid grid-cols-3 gap-3">
            {/* Big stat */}
            <div className="col-span-2 border-2 border-canvas/15 bg-card/40 p-5 hover-lift sticker">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-flamingo/80">✦ Total budget</p>
              <p className="font-display text-[64px] leading-none text-canvas mt-2">
                <AnimatedCounter value={trip.total_cost_estimate_usd} prefix="$" />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-canvas/40 mt-2">
                Per person, all-in
              </p>
            </div>

            {/* Small stats column */}
            <div className="space-y-3">
              <div className="border border-canvas/15 bg-card/40 p-3 hover-lift">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-canvas/40">Per day</p>
                <p className="font-display text-[24px] leading-none text-canvas mt-1">
                  <AnimatedCounter value={trip.cost_per_day_usd} prefix="$" />
                </p>
              </div>
              <div className="border border-canvas/15 bg-card/40 p-3 hover-lift">
                <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-canvas/40">Status</p>
                <div className="mt-1">
                  <BudgetBadge status={trip.budget_status} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION HEADER === */}
        <div className="mb-12 reveal">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-flamingo">
            ✶ Day-by-day
          </p>
          <h2 className="font-display text-[44px] leading-[0.95] tracking-[-0.025em] text-canvas mt-3">
            Your <span className="italic text-flamingo">itinerary</span>.
          </h2>
          <Squiggle className="w-32 h-3 mt-3" color="var(--color-sunset)" />
        </div>

        {/* === DAYS === */}
        <section className="mb-20 space-y-1">
          {trip.days.map((day) => (
            <DayCard key={day.day_number} day={day} />
          ))}
        </section>

        {/* === ALSO WORTH KNOWING === */}
        <section className="mb-20 reveal">
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-sunset">
              ✶ Beyond the plan
            </p>
            <h2 className="font-display text-[44px] leading-[0.95] tracking-[-0.025em] text-canvas mt-3">
              Also worth <span className="italic text-sunset">knowing</span>.
            </h2>
          </div>
          <ThemedList title="Best Food" spots={trip.themed_lists.best_food} />
          <ThemedList title="Best Views" spots={trip.themed_lists.best_views} />
          <ThemedList title="Best Nightlife" spots={trip.themed_lists.best_nightlife} />
          <ThemedList title="Best Hidden Gems" spots={trip.themed_lists.best_hidden_gems} />
        </section>

        {/* === MAP === */}
        <section className="mb-16 reveal">
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-goldenrod">
              ✶ All pinned
            </p>
            <h2 className="font-display text-[44px] leading-[0.95] tracking-[-0.025em] text-canvas mt-3">
              The <span className="italic text-goldenrod">map</span>.
            </h2>
          </div>
          <div className="border-2 border-canvas/15 sticker">
            <TripMap days={trip.days} />
          </div>
        </section>

        {/* === CTA === */}
        <footer className="reveal mt-20">
          <Link
            href="/"
            className="group relative block w-full py-6 bg-flamingo text-midnight font-display text-[28px] tracking-tight text-center hover:bg-canvas transition-all duration-400 btn-shine border-2 border-flamingo overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Generate another
              <span className="font-serif italic group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </Link>
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-canvas/30 mt-4">
            One trip at a time
          </p>
        </footer>
      </main>

      {/* === FOOTER MARQUEE === */}
      <div className="relative z-10 bg-canvas text-midnight border-t border-midnight py-2.5 overflow-hidden">
        <Marquee speed="slow" reverse separator="◆" separatorClassName="text-flamingo">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">@aiwithani × HUVA × Claude</span>
          <span className="font-display italic text-[18px]">Made for travelers, not tourists</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Travel Vibe Generator</span>
        </Marquee>
      </div>
    </div>
  );
}

export default function TripPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center grain">
        <div className="w-3 h-3 bg-flamingo pulse-square" />
      </div>
    }>
      <TripContent />
    </Suspense>
  );
}
