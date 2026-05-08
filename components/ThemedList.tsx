"use client";

import { useState } from "react";
import { Spot } from "@/lib/types";
import SpotCard from "./SpotCard";

const ICONS: Record<string, string> = {
  "Best Food": "🍴",
  "Best Views": "🌅",
  "Best Nightlife": "🌙",
  "Best Hidden Gems": "💎",
};

export default function ThemedList({
  title,
  spots,
}: {
  title: string;
  spots: Spot[];
}) {
  const [open, setOpen] = useState(false);
  const icon = ICONS[title] || "◆";

  return (
    <div className="border-b border-canvas/8 mb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="flex items-center gap-3">
          <span className="text-[18px] transition-transform duration-300 group-hover:scale-110">{icon}</span>
          <span className="font-serif text-[20px] font-medium text-canvas group-hover:text-flamingo transition-colors duration-300">
            {title}
          </span>
          <span className="font-condensed text-[11px] text-placeholder/30 ml-1">{spots.length}</span>
        </span>
        <span
          className={`text-flamingo/60 text-[14px] font-light transition-transform duration-400 ${open ? "rotate-45" : "rotate-0"}`}
        >
          +
        </span>
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div className="accordion-inner">
          <div className="pb-6 pt-1">
            {spots.map((spot, i) => (
              <SpotCard key={i} spot={spot} showTravel={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
