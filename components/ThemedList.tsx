"use client";

import { useState } from "react";
import { Spot } from "@/lib/types";
import SpotCard from "./SpotCard";
import { Plus } from "./Decorations";

const ICONS: Record<string, string> = {
  "Best Food": "🍴",
  "Best Views": "🌅",
  "Best Nightlife": "🌙",
  "Best Hidden Gems": "💎",
};

const ACCENTS: Record<string, string> = {
  "Best Food": "var(--color-sunset)",
  "Best Views": "var(--color-goldenrod)",
  "Best Nightlife": "var(--color-flamingo)",
  "Best Hidden Gems": "var(--color-passion)",
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
  const accent = ACCENTS[title] || "var(--color-flamingo)";

  return (
    <div className="border-t border-canvas/10 last:border-b">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex items-center justify-between text-left group transition-all duration-300"
      >
        <span className="flex items-center gap-4">
          <span className="text-[20px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">{icon}</span>
          <span className="font-display text-[26px] tracking-[-0.02em] text-canvas group-hover:opacity-80 transition-all duration-300" style={{ color: open ? accent : undefined }}>
            {title}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-canvas/30">
            ({spots.length})
          </span>
        </span>
        <span
          className="transition-transform duration-400"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0)", color: accent }}
        >
          <Plus size={20} color="currentColor" />
        </span>
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div className="accordion-inner">
          <div className="pb-8 pt-2 space-y-1">
            {spots.map((spot, i) => (
              <SpotCard key={i} spot={spot} showTravel={false} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
