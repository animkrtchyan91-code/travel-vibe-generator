"use client";

import { Day } from "@/lib/types";
import SpotCard from "./SpotCard";
import { Sparkle } from "./Decorations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DAY_THEMES = [
  { accent: "from-flamingo/25 to-transparent", color: "var(--color-flamingo)", numberColor: "text-flamingo" },
  { accent: "from-sunset/25 to-transparent", color: "var(--color-sunset)", numberColor: "text-sunset" },
  { accent: "from-goldenrod/25 to-transparent", color: "var(--color-goldenrod)", numberColor: "text-goldenrod" },
  { accent: "from-ocean/25 to-transparent", color: "var(--color-ocean)", numberColor: "text-ocean" },
  { accent: "from-passion/25 to-transparent", color: "var(--color-passion)", numberColor: "text-passion" },
  { accent: "from-blaze/25 to-transparent", color: "var(--color-blaze)", numberColor: "text-blaze" },
  { accent: "from-sage/25 to-transparent", color: "var(--color-sage)", numberColor: "text-sage" },
];

function TimeBlock({ label, spots, accentColor }: { label: string; spots: Day["morning"]; accentColor: string }) {
  if (spots.length === 0) return null;
  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: accentColor }}
        />
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-canvas/60">
          {label}
        </h3>
        <span className="flex-1 h-[1px] bg-canvas/8" />
        <span className="font-mono text-[10px] text-canvas/30">{spots.length}</span>
      </div>
      <div className="space-y-1">
        {spots.map((spot, i) => (
          <SpotCard key={i} spot={spot} showTravel={i < spots.length - 1} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function DayCard({ day }: { day: Day }) {
  const theme = DAY_THEMES[(day.day_number - 1) % DAY_THEMES.length];
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="reveal relative border-2 border-canvas/12 bg-card/50 mb-10 overflow-hidden hover-lift"
    >
      {/* === HEADER === */}
      <div className={`relative bg-gradient-to-br ${theme.accent} px-6 pt-6 pb-7 overflow-hidden`}>
        {/* Massive day number */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-canvas/60 mb-2">
              ✦ Day
            </p>
            <h2 className={`font-display text-[120px] leading-[0.78] tracking-[-0.06em] ${theme.numberColor} -ml-1`}>
              {day.day_number.toString().padStart(2, "0")}
            </h2>
            <p className="font-serif italic text-[20px] text-canvas/85 mt-3 leading-tight">
              {day.theme}
            </p>
          </div>

          {/* Right column: badge */}
          <div className="shrink-0 mt-1">
            <div className="border border-canvas/30 px-2.5 py-1.5 bg-midnight/40 backdrop-blur-sm sticker-tilt-r">
              <Sparkle size={10} color={theme.color} className="inline-block mr-1 align-middle" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-canvas/70">
                Day {day.day_number}/{}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* === BODY === */}
      <div className="px-6 pb-7">
        <TimeBlock label="Morning" spots={day.morning} accentColor={theme.color} />
        <TimeBlock label="Afternoon" spots={day.afternoon} accentColor={theme.color} />
        <TimeBlock label="Evening" spots={day.evening} accentColor={theme.color} />

        {/* === DAY TOTAL === */}
        <div className="mt-12 pt-5 border-t-2 border-dashed border-canvas/12">
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-canvas/50">
              Day total
            </p>
            <p className="font-display text-[34px] leading-none" style={{ color: theme.color }}>
              ${day.day_total_usd}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
