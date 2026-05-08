"use client";

import { useState } from "react";
import { TripFormData } from "@/lib/types";
import { useMultiReveal } from "@/hooks/useScrollReveal";
import { Sparkle } from "@/components/Decorations";

const VIBES = ["Chill", "Party", "Romantic", "Foodie", "Adventure", "Culture", "Hidden Gems"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DIETARY_OPTIONS = ["Vegan", "Vegetarian", "Halal", "Gluten-free", "Kosher"];

const BUDGET_RANGES: Record<string, string> = {
  backpacker: "$30–$60",
  mid: "$80–$150",
  luxury: "$200–$500",
};

function StampButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-5 py-2.5 font-condensed text-[14px] font-medium tracking-wide uppercase border transition-all duration-300 ${
        active
          ? "bg-canvas text-midnight border-canvas sticker"
          : "bg-transparent text-canvas/80 border-canvas/20 hover:border-canvas/60 hover:text-canvas"
      }`}
    >
      {label}
    </button>
  );
}

function PillSelect({
  options,
  selected,
  onChange,
  max,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  max: number;
}) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
    else if (selected.length < max) onChange([...selected, opt]);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`relative px-4 py-2 font-condensed text-[13px] font-medium uppercase tracking-wide border transition-all duration-300 ${
              isActive
                ? "bg-flamingo text-midnight border-flamingo sticker"
                : "bg-transparent text-canvas/70 border-canvas/20 hover:border-canvas/50 hover:text-canvas"
            }`}
          >
            {isActive && <Sparkle size={10} color="currentColor" className="inline-block mr-1.5 align-middle" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function NumberedSection({
  number,
  label,
  hint,
  children,
}: {
  number: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="reveal">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-[11px] tracking-widest text-flamingo/80">{number}</span>
        <span className="flex-1 h-[1px] bg-canvas/15" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/50">
          {label}
        </span>
      </div>
      {hint && (
        <p className="font-serif italic text-[15px] text-canvas/55 -mt-2 mb-4 leading-snug">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

export default function InputForm({
  onSubmit,
}: {
  onSubmit: (data: TripFormData) => void;
}) {
  useMultiReveal(".reveal");

  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [customDays, setCustomDays] = useState(false);
  const [tripType, setTripType] = useState<"first_time" | "been_before" | "live_here">("first_time");
  const [vibes, setVibes] = useState<string[]>([]);
  const [pace, setPace] = useState<"slow" | "balanced" | "packed">("balanced");
  const [travelStyle, setTravelStyle] = useState("solo");
  const [budgetTier, setBudgetTier] = useState<"backpacker" | "mid" | "luxury">("mid");
  const [dailyBudget, setDailyBudget] = useState(100);
  const [walking, setWalking] = useState<"minimal" | "moderate" | "lots">("moderate");
  const [dietary, setDietary] = useState<string[]>([]);
  const [month, setMonth] = useState("May");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSubmit({
      city: city.trim(),
      days,
      trip_type: tripType,
      vibes,
      pace,
      travel_style: travelStyle as TripFormData["travel_style"],
      budget_tier: budgetTier,
      daily_budget: dailyBudget,
      walking,
      dietary,
      month,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <NumberedSection number="01" label="Destination" hint="The place that's been on your list.">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Lisbon, Tokyo, Mexico City..."
          className="w-full py-3 text-[24px] font-display italic bg-transparent border-b-2 border-canvas/15 focus:border-flamingo placeholder:text-placeholder/30 transition-colors duration-300"
          required
        />
      </NumberedSection>

      <NumberedSection number="02" label="Duration">
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { setDays(d); setCustomDays(false); }}
              className={`w-12 h-12 font-display text-[20px] border transition-all duration-300 ${
                days === d && !customDays
                  ? "bg-canvas text-midnight border-canvas sticker"
                  : "bg-transparent text-canvas/50 border-canvas/15 hover:border-canvas/40 hover:text-canvas"
              }`}
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setCustomDays(true); setDays(8); }}
            className={`px-3 h-12 font-condensed text-[12px] uppercase tracking-wider border transition-all duration-300 ${
              customDays
                ? "bg-canvas text-midnight border-canvas sticker"
                : "bg-transparent text-canvas/50 border-canvas/15 hover:border-canvas/40 hover:text-canvas"
            }`}
          >
            8+
          </button>
        </div>
        {customDays && (
          <input
            type="number"
            min={8}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-3 w-24 py-2 text-[16px] font-display bg-transparent border-b border-canvas/20 focus:border-flamingo"
          />
        )}
      </NumberedSection>

      <NumberedSection number="03" label="First time?">
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "First time", value: "first_time" },
            { label: "Been before", value: "been_before" },
            { label: "I live here", value: "live_here" },
          ].map((opt) => (
            <StampButton
              key={opt.value}
              label={opt.label}
              active={tripType === opt.value}
              onClick={() => setTripType(opt.value as typeof tripType)}
            />
          ))}
        </div>
      </NumberedSection>

      <NumberedSection number="04" label="The vibe" hint="Pick up to three. Be greedy.">
        <PillSelect options={VIBES} selected={vibes} onChange={setVibes} max={3} />
      </NumberedSection>

      <NumberedSection number="05" label="Pace">
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Slow", value: "slow" },
            { label: "Balanced", value: "balanced" },
            { label: "Packed", value: "packed" },
          ].map((opt) => (
            <StampButton
              key={opt.value}
              label={opt.label}
              active={pace === opt.value}
              onClick={() => setPace(opt.value as typeof pace)}
            />
          ))}
        </div>
      </NumberedSection>

      <NumberedSection number="06" label="Who with">
        <select
          value={travelStyle}
          onChange={(e) => setTravelStyle(e.target.value)}
          className="w-full py-3 text-[18px] font-serif italic bg-transparent border-b border-canvas/15 focus:border-flamingo transition-colors duration-300"
        >
          <option value="solo">Solo — by myself</option>
          <option value="couple">Couple — two of us</option>
          <option value="family">Family — kids in tow</option>
          <option value="friends">Friends — crew of us</option>
        </select>
      </NumberedSection>

      <NumberedSection number="07" label="Budget tier">
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Backpacker", value: "backpacker" },
            { label: "Mid", value: "mid" },
            { label: "Luxury", value: "luxury" },
          ].map((opt) => (
            <StampButton
              key={opt.value}
              label={opt.label}
              active={budgetTier === opt.value}
              onClick={() => setBudgetTier(opt.value as typeof budgetTier)}
            />
          ))}
        </div>
      </NumberedSection>

      <NumberedSection number="08" label="Daily budget">
        <div className="flex items-baseline gap-3">
          <span className="text-flamingo font-display text-[36px] leading-none">$</span>
          <input
            type="number"
            min={10}
            max={2000}
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className="w-32 py-2 text-[28px] font-display bg-transparent border-b border-canvas/15 focus:border-flamingo transition-colors duration-300"
          />
          <span className="font-mono text-[11px] uppercase tracking-wider text-canvas/40">/ day</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-canvas/40 mt-3">
          Typical {budgetTier}: <span className="text-flamingo">{BUDGET_RANGES[budgetTier]}</span>
        </p>
      </NumberedSection>

      <NumberedSection number="09" label="Walking tolerance">
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Minimal", value: "minimal" },
            { label: "Moderate", value: "moderate" },
            { label: "Lots", value: "lots" },
          ].map((opt) => (
            <StampButton
              key={opt.value}
              label={opt.label}
              active={walking === opt.value}
              onClick={() => setWalking(opt.value as typeof walking)}
            />
          ))}
        </div>
      </NumberedSection>

      <NumberedSection number="10" label="Dietary">
        <PillSelect
          options={DIETARY_OPTIONS}
          selected={dietary}
          onChange={setDietary}
          max={5}
        />
        {dietary.length === 0 && (
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-canvas/40 mt-3">
            None selected — no restrictions
          </p>
        )}
      </NumberedSection>

      <NumberedSection number="11" label="When">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full py-3 text-[18px] font-serif italic bg-transparent border-b border-canvas/15 focus:border-flamingo transition-colors duration-300"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </NumberedSection>

      <div className="h-32" />

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-midnight/95 backdrop-blur-md border-t border-canvas/8 z-50">
        <button
          type="submit"
          disabled={!city.trim()}
          className="group relative w-full py-5 bg-flamingo text-midnight font-display text-[22px] tracking-tight hover:bg-canvas disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-400 btn-shine border-2 border-flamingo overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            Generate my trip
            <span className="font-serif italic text-flamingo group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
        </button>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.3em] text-canvas/30 mt-2">
          Verified by Claude · ~60 seconds
        </p>
      </div>
    </form>
  );
}
