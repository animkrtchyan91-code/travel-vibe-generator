"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { TripPlan } from "@/lib/types";
import DayCard from "@/components/DayCard";
import ThemedList from "@/components/ThemedList";
import BudgetBadge from "@/components/BudgetBadge";
import TripMap from "@/components/TripMap";
import { useMultiReveal } from "@/hooks/useScrollReveal";

const CITY_IMAGES: Record<string, string> = {
  lisbon: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=1200&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
  istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80",
  "mexico city": "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=1200&q=80",
  amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80",
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80";

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
          const duration = 1200;
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
        if (img) {
          img.style.transform = `translateY(${scrollY * 0.35}px) scale(1.15)`;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (error) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        <p className="text-sunset font-serif text-[16px] italic mb-6">{error}</p>
        <Link href="/" className="font-condensed text-[14px] font-medium uppercase tracking-[0.1em] text-canvas border border-canvas/30 px-6 py-3 hover:bg-canvas hover:text-midnight transition-all duration-300 btn-shine">
          ← Start over
        </Link>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-flamingo pulse-square" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh grain">
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-flamingo/5 blur-[100px] float-orb" />
        <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-goldenrod/5 blur-[120px] float-orb" style={{ animationDelay: "-4s" }} />
      </div>

      {/* Hero with city image + parallax */}
      <div ref={heroRef} className="relative h-[55vh] min-h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center parallax-slow scale-115"
          style={{ backgroundImage: `url('${cityImageUrl(trip.city)}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/50 to-midnight" />

        <div className="absolute top-0 left-0 right-0 z-40 px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 font-condensed text-[12px] font-medium uppercase tracking-[0.15em] text-canvas/50 hover:text-flamingo transition-colors duration-300">
            <span className="w-4 h-[1px] bg-current" />
            back
          </Link>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-10 max-w-md mx-auto hero-text-reveal">
          <h1 className="font-display text-[80px] leading-[0.85] tracking-[-0.03em] text-canvas">
            {trip.city}
          </h1>
          <p className="font-serif text-[17px] italic text-canvas/50 mt-4 leading-[1.4]">
            {trip.weather_note}
          </p>
        </div>
      </div>

      <main className="relative z-10 px-6 pt-10 pb-16 max-w-md mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-14 reveal stagger-children">
          <div className="border border-canvas/10 bg-card/50 p-4 hover-lift">
            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.15em] text-placeholder/60">Total</p>
            <p className="font-display text-[28px] text-canvas mt-1.5">
              <AnimatedCounter value={trip.total_cost_estimate_usd} prefix="$" />
            </p>
          </div>
          <div className="border border-canvas/10 bg-card/50 p-4 hover-lift">
            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.15em] text-placeholder/60">Per day</p>
            <p className="font-display text-[28px] text-canvas mt-1.5">
              <AnimatedCounter value={trip.cost_per_day_usd} prefix="$" />
            </p>
          </div>
          <div className="border border-canvas/10 bg-card/50 p-4 hover-lift">
            <p className="font-condensed text-[10px] font-semibold uppercase tracking-[0.15em] text-placeholder/60">Budget</p>
            <div className="mt-2.5">
              <BudgetBadge status={trip.budget_status} />
            </div>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-14 reveal">
          <div className="flex-1 h-[1px] shimmer-line bg-gradient-to-r from-transparent to-flamingo/30" />
          <span className="font-condensed text-[10px] uppercase tracking-[0.25em] text-placeholder/50">Your itinerary</span>
          <div className="flex-1 h-[1px] shimmer-line bg-gradient-to-l from-transparent to-flamingo/30" />
        </div>

        {/* Day cards */}
        <section className="mb-16">
          {trip.days.map((day) => (
            <DayCard key={day.day_number} day={day} />
          ))}
        </section>

        {/* Themed lists */}
        <section className="mb-16 reveal">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[2px] bg-sunset" />
            <h2 className="font-display text-[34px] leading-[1] tracking-[-0.03em] text-canvas">
              Also worth knowing.
            </h2>
          </div>
          <ThemedList title="Best Food" spots={trip.themed_lists.best_food} />
          <ThemedList title="Best Views" spots={trip.themed_lists.best_views} />
          <ThemedList title="Best Nightlife" spots={trip.themed_lists.best_nightlife} />
          <ThemedList title="Best Hidden Gems" spots={trip.themed_lists.best_hidden_gems} />
        </section>

        {/* Map */}
        <section className="mb-16 reveal">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[2px] bg-goldenrod" />
            <h2 className="font-display text-[34px] leading-[1] tracking-[-0.03em] text-canvas">
              The map.
            </h2>
          </div>
          <TripMap days={trip.days} />
        </section>

        {/* Footer */}
        <footer className="reveal">
          <div className="py-6 border-t border-canvas/10 text-center">
            <p className="font-condensed text-[11px] font-medium uppercase tracking-[0.2em] text-placeholder/40">
              Built with Claude × HUVA — @aiwithani
            </p>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-block w-full py-4 bg-transparent border border-canvas/60 text-canvas font-condensed text-[14px] font-semibold uppercase tracking-[0.12em] text-center hover:bg-canvas hover:text-midnight transition-all duration-400 btn-shine"
            >
              Generate another →
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function TripPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-flamingo pulse-square" />
      </div>
    }>
      <TripContent />
    </Suspense>
  );
}
