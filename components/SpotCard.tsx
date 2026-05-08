import { Spot } from "@/lib/types";
import { Sparkle } from "./Decorations";

const BADGE_STYLES: Record<string, string> = {
  "Trending on TikTok": "bg-sunset text-canvas border-sunset",
  "Reddit local pick": "bg-ocean text-canvas border-ocean",
  "Local blog favorite": "bg-goldenrod text-midnight border-goldenrod",
  "Hidden gem": "bg-flamingo text-midnight border-flamingo",
  "Classic must-see": "bg-canvas text-midnight border-canvas",
};

const PRICE_TIER_LABELS: Record<string, string> = {
  "$": "Free / cheap",
  "$$": "Affordable",
  "$$$": "Splurge",
  "$$$$": "Bucket list",
};

export default function SpotCard({
  spot,
  showTravel = true,
  index = 0,
}: {
  spot: Spot;
  showTravel?: boolean;
  index?: number;
}) {
  const badgeStyle = BADGE_STYLES[spot.trending_badge] || BADGE_STYLES["Classic must-see"];
  const priceLabel = PRICE_TIER_LABELS[spot.price_tier] || spot.price_tier;

  // Subtle alternating tilt for postcard feel
  const tilt = index % 2 === 0 ? "hover:-rotate-[0.4deg]" : "hover:rotate-[0.4deg]";

  return (
    <article className={`group relative pl-4 -ml-4 border-l-2 border-canvas/0 hover:border-flamingo/40 transition-all duration-400 py-4 ${tilt}`}>
      {/* Index marker */}
      <span className="absolute -left-1 top-4 font-mono text-[10px] tracking-wider text-canvas/30 group-hover:text-flamingo transition-colors duration-300">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="space-y-3 pl-4">
        {/* Title */}
        <h4 className="font-display text-[28px] leading-[1.05] text-canvas group-hover:text-flamingo transition-colors duration-400 tracking-[-0.02em]">
          {spot.name}
        </h4>

        {/* Description */}
        <p className="font-serif text-[15px] text-canvas/60 leading-[1.5] tracking-wide max-w-[34ch]">
          {spot.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-canvas/35 pt-1">
          <span>~{spot.time_at_spot_minutes}min</span>
          <span className="w-px h-3 bg-canvas/20" />
          <span>{priceLabel}</span>
          <span className="w-px h-3 bg-canvas/20" />
          <span>~${spot.estimated_cost_usd_pp}</span>
        </div>

        {/* Stamps */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide bg-goldenrod text-midnight border border-goldenrod sticker-tilt-l">
            ${spot.estimated_cost_usd_pp}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide border sticker-tilt-r ${badgeStyle}`}>
            <Sparkle size={8} color="currentColor" className="align-middle" />
            {spot.trending_badge}
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-1.5 pt-2 flex-wrap">
          <a
            href={spot.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 px-3 py-1.5 border border-canvas/15 font-mono text-[10px] uppercase tracking-wider text-canvas/60 hover:text-flamingo hover:border-flamingo/40 hover:bg-flamingo/5 transition-all duration-300"
          >
            <span>↗</span> Maps
          </a>
          {spot.official_url && (
            <a
              href={spot.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-canvas/15 font-mono text-[10px] uppercase tracking-wider text-canvas/60 hover:text-flamingo hover:border-flamingo/40 hover:bg-flamingo/5 transition-all duration-300"
            >
              <span>↗</span> Site
            </a>
          )}
          {spot.booking_url && (
            <a
              href={spot.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-canvas/15 font-mono text-[10px] uppercase tracking-wider text-canvas/60 hover:text-flamingo hover:border-flamingo/40 hover:bg-flamingo/5 transition-all duration-300"
            >
              <span>↗</span> Book
            </a>
          )}
        </div>
      </div>

      {/* Travel to next */}
      {showTravel && spot.travel_to_next && (
        <div className="mt-5 ml-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/30">
          <span className="text-flamingo/60">↓</span>
          <span>{spot.travel_to_next.minutes}min {spot.travel_to_next.mode}</span>
          <span className="flex-1 h-px bg-gradient-to-r from-flamingo/20 to-transparent" />
        </div>
      )}
    </article>
  );
}
