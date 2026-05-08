"use client";

import { Day } from "@/lib/types";
import SpotCard from "./SpotCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DAY_ACCENTS = [
  "from-flamingo/20 to-transparent",
  "from-sunset/20 to-transparent",
  "from-goldenrod/20 to-transparent",
  "from-ocean/20 to-transparent",
  "from-passion/20 to-transparent",
  "from-blaze/20 to-transparent",
  "from-sage/20 to-transparent",
];

function TimeBlock({ label, spots }: { label: string; spots: Day["morning"] }) {
  if (spots.length === 0) return null;
  return (
    <div className="mt-8">
      <h3 className="font-condensed text-[12px] font-semibold uppercase tracking-[0.15em] text-placeholder/60 mb-5 flex items-center gap-3">
        <span className="w-3 h-[1px] bg-canvas/20" />
        {label}
      </h3>
      {spots.map((spot, i) => (
        <SpotCard key={i} spot={spot} showTravel={i < spots.length - 1} />
      ))}
    </div>
  );
}

export default function DayCard({ day }: { day: Day }) {
  const accent = DAY_ACCENTS[(day.day_number - 1) % DAY_ACCENTS.length];
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="reveal border border-canvas/10 bg-card/60 mb-8 overflow-hidden hover-lift">
      <div className={`bg-gradient-to-r ${accent} px-7 pt-7 pb-5`}>
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-[56px] leading-[0.85] tracking-[-0.03em] text-flamingo">
            Day {day.day_number}
          </h2>
        </div>
        <p className="font-condensed text-[13px] font-medium uppercase tracking-[0.08em] text-canvas/50 mt-2">
          {day.theme}
        </p>
      </div>

      <div className="px-7 pb-7">
        <TimeBlock label="Morning" spots={day.morning} />
        <TimeBlock label="Afternoon" spots={day.afternoon} />
        <TimeBlock label="Evening" spots={day.evening} />

        <div className="mt-8 pt-5 border-t border-canvas/8">
          <div className="flex items-center justify-between">
            <p className="font-condensed text-[12px] font-medium uppercase tracking-[0.08em] text-placeholder/50">
              Day total
            </p>
            <p className="font-display text-[22px] text-goldenrod">
              ${day.day_total_usd}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
