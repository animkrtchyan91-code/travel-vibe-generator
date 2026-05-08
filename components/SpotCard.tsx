import { Spot } from "@/lib/types";

const BADGE_STYLES: Record<string, string> = {
  "Trending on TikTok": "bg-sunset/10 text-sunset border-sunset/25",
  "Reddit local pick": "bg-ocean/10 text-ocean border-ocean/25",
  "Local blog favorite": "bg-goldenrod/10 text-goldenrod border-goldenrod/25",
  "Hidden gem": "bg-flamingo/10 text-flamingo border-flamingo/25",
  "Classic must-see": "bg-canvas/5 text-canvas/60 border-canvas/15",
};

export default function SpotCard({
  spot,
  showTravel = true,
}: {
  spot: Spot;
  showTravel?: boolean;
}) {
  const badgeStyle = BADGE_STYLES[spot.trending_badge] || BADGE_STYLES["Classic must-see"];

  return (
    <div className="mb-7 group">
      <div className="space-y-3">
        <h4 className="font-serif text-[20px] font-medium text-canvas leading-[1.1] group-hover:text-flamingo transition-colors duration-300">
          {spot.name}
        </h4>
        <p className="font-sans text-[14px] text-placeholder/70 leading-[1.5] tracking-[0.01em]">
          {spot.description}
        </p>

        <div className="font-condensed text-[12px] text-placeholder/40 tracking-wide">
          ~{spot.time_at_spot_minutes} min · {spot.price_tier} · ~${spot.estimated_cost_usd_pp} pp
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 font-condensed text-[10px] font-semibold uppercase tracking-wide bg-goldenrod/10 text-goldenrod border border-goldenrod/20 rounded-sm">
            ${spot.estimated_cost_usd_pp}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 font-condensed text-[10px] font-semibold uppercase tracking-wide border rounded-sm ${badgeStyle}`}>
            {spot.trending_badge}
          </span>
        </div>

        <div className="flex gap-2 mt-1.5 pt-1">
          <a
            href={spot.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-canvas/10 font-condensed text-[11px] text-placeholder/50 hover:text-flamingo hover:border-flamingo/30 transition-all duration-300 hover:translate-y-[-1px]"
          >
            Maps
          </a>
          {spot.official_url && (
            <a
              href={spot.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-canvas/10 font-condensed text-[11px] text-placeholder/50 hover:text-flamingo hover:border-flamingo/30 transition-all duration-300 hover:translate-y-[-1px]"
            >
              Site
            </a>
          )}
          {spot.booking_url && (
            <a
              href={spot.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-canvas/10 font-condensed text-[11px] text-placeholder/50 hover:text-flamingo hover:border-flamingo/30 transition-all duration-300 hover:translate-y-[-1px]"
            >
              Book
            </a>
          )}
        </div>
      </div>

      {showTravel && spot.travel_to_next && (
        <div className="mt-5 pl-4 border-l border-flamingo/15">
          <p className="font-condensed text-[12px] italic text-placeholder/30 tracking-wide">
            {spot.travel_to_next.minutes} min {spot.travel_to_next.mode} to next
          </p>
        </div>
      )}
    </div>
  );
}
