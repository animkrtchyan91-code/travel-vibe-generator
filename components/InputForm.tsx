"use client";

import { useState } from "react";
import { TripFormData } from "@/lib/types";
import { useMultiReveal } from "@/hooks/useScrollReveal";

const VIBES = ["Chill", "Party", "Romantic", "Foodie", "Adventure", "Culture", "Hidden Gems"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DIETARY_OPTIONS = ["Vegan", "Vegetarian", "Halal", "Gluten-free", "Kosher"];

const BUDGET_RANGES: Record<string, string> = {
  backpacker: "$30–$60",
  mid: "$80–$150",
  luxury: "$200–$500",
};

function GhostButton({
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
      className={`px-5 py-2.5 font-condensed text-[14px] font-medium tracking-[-0.02em] border transition-all duration-300 ${
        active
          ? "bg-canvas text-midnight border-canvas scale-[1.02]"
          : "bg-transparent text-canvas border-canvas/20 hover:border-canvas/50 hover:scale-[1.02]"
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
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else if (selected.length < max) {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="flex gap-2.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-5 py-2 font-condensed text-[14px] font-medium rounded-full border transition-all duration-300 ${
            selected.includes(opt)
              ? "bg-flamingo/15 text-flamingo border-flamingo/40 scale-[1.02]"
              : "bg-transparent text-canvas/70 border-canvas/20 hover:border-canvas/40 hover:text-canvas hover:scale-[1.02]"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FormSection({ label, children, index }: { label: string; children: React.ReactNode; index: number }) {
  return (
    <div className="reveal" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-4 h-[1px] bg-flamingo/40" />
        <label className="font-condensed text-[12px] font-semibold uppercase tracking-[0.15em] text-placeholder">
          {label}
        </label>
      </div>
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
    <form onSubmit={handleSubmit} className="space-y-11">
      <FormSection label="Where" index={0}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Lisbon, Tokyo, Mexico City..."
          className="w-full py-3 text-[18px] font-serif italic bg-transparent border-b border-canvas/20 focus:border-flamingo placeholder:text-placeholder/30 tracking-[0.01em] transition-colors duration-300"
          required
        />
      </FormSection>

      <FormSection label="How many days" index={1}>
        <div className="flex gap-2 flex-wrap stagger-children visible">
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { setDays(d); setCustomDays(false); }}
              className={`w-12 h-12 font-condensed text-[15px] font-medium border transition-all duration-300 ${
                days === d && !customDays
                  ? "bg-canvas text-midnight border-canvas"
                  : "bg-transparent text-canvas/60 border-canvas/15 hover:border-canvas/40 hover:text-canvas"
              }`}
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setCustomDays(true); setDays(8); }}
            className={`px-4 h-12 font-condensed text-[15px] font-medium border transition-all duration-300 ${
              customDays
                ? "bg-canvas text-midnight border-canvas"
                : "bg-transparent text-canvas/60 border-canvas/15 hover:border-canvas/40 hover:text-canvas"
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
            className="mt-3 w-24 py-2 text-[14px] font-sans bg-transparent border-b border-canvas/20 focus:border-flamingo transition-colors duration-300"
          />
        )}
      </FormSection>

      <FormSection label="Is this your first time?" index={2}>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { label: "First time", value: "first_time" },
            { label: "Been before", value: "been_before" },
            { label: "I live here", value: "live_here" },
          ].map((opt) => (
            <GhostButton
              key={opt.value}
              label={opt.label}
              active={tripType === opt.value}
              onClick={() => setTripType(opt.value as typeof tripType)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection label="The vibe" index={3}>
        <PillSelect options={VIBES} selected={vibes} onChange={setVibes} max={3} />
        <p className="font-condensed text-[12px] text-placeholder/40 mt-2.5 tracking-wide">pick up to 3</p>
      </FormSection>

      <FormSection label="Pace" index={4}>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { label: "Slow", value: "slow" },
            { label: "Balanced", value: "balanced" },
            { label: "Packed", value: "packed" },
          ].map((opt) => (
            <GhostButton
              key={opt.value}
              label={opt.label}
              active={pace === opt.value}
              onClick={() => setPace(opt.value as typeof pace)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection label="Who with" index={5}>
        <select
          value={travelStyle}
          onChange={(e) => setTravelStyle(e.target.value)}
          className="w-full py-3 text-[16px] font-serif italic bg-transparent border-b border-canvas/20 focus:border-flamingo transition-colors duration-300"
        >
          <option value="solo">Solo</option>
          <option value="couple">Couple</option>
          <option value="family">Family</option>
          <option value="friends">Friends</option>
        </select>
      </FormSection>

      <FormSection label="Budget tier" index={6}>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { label: "Backpacker", value: "backpacker" },
            { label: "Mid", value: "mid" },
            { label: "Luxury", value: "luxury" },
          ].map((opt) => (
            <GhostButton
              key={opt.value}
              label={opt.label}
              active={budgetTier === opt.value}
              onClick={() => setBudgetTier(opt.value as typeof budgetTier)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection label="Daily budget" index={7}>
        <div className="flex items-baseline gap-2">
          <span className="text-flamingo/60 font-display text-[24px]">$</span>
          <input
            type="number"
            min={10}
            max={2000}
            value={dailyBudget}
            onChange={(e) => setDailyBudget(Number(e.target.value))}
            className="w-28 py-2 text-[18px] font-serif bg-transparent border-b border-canvas/20 focus:border-flamingo transition-colors duration-300"
          />
        </div>
        <p className="font-condensed text-[12px] text-placeholder/40 mt-2 tracking-wide">
          typical for {budgetTier}: {BUDGET_RANGES[budgetTier]}
        </p>
      </FormSection>

      <FormSection label="Walking" index={8}>
        <div className="flex gap-2.5 flex-wrap">
          {[
            { label: "Minimal", value: "minimal" },
            { label: "Moderate", value: "moderate" },
            { label: "Lots", value: "lots" },
          ].map((opt) => (
            <GhostButton
              key={opt.value}
              label={opt.label}
              active={walking === opt.value}
              onClick={() => setWalking(opt.value as typeof walking)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection label="Dietary" index={9}>
        <PillSelect
          options={DIETARY_OPTIONS}
          selected={dietary}
          onChange={setDietary}
          max={5}
        />
        {dietary.length === 0 && (
          <p className="font-condensed text-[12px] text-placeholder/40 mt-2 tracking-wide">none selected = no restrictions</p>
        )}
      </FormSection>

      <FormSection label="When" index={10}>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full py-3 text-[16px] font-serif italic bg-transparent border-b border-canvas/20 focus:border-flamingo transition-colors duration-300"
        >
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </FormSection>

      <div className="h-24" />

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-midnight/95 backdrop-blur-md border-t border-canvas/8 z-50">
        <button
          type="submit"
          disabled={!city.trim()}
          className="w-full py-4 bg-transparent text-canvas font-condensed text-[16px] font-semibold uppercase tracking-[0.12em] border border-canvas/80 hover:bg-canvas hover:text-midnight disabled:opacity-15 disabled:cursor-not-allowed transition-all duration-400 btn-shine"
        >
          Generate my trip →
        </button>
      </div>
    </form>
  );
}
