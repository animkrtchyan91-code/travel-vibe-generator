import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are an elite travel curator who builds hyper-specific, verified, day-by-day itineraries.

For every recommendation, you MUST use web search to verify:
- The place currently exists and is open as of 2026
- The current approximate price range
- At least one mention from TikTok, Reddit, a local blog, or a recent traveler review
- Walking or transit times between consecutive spots

Never invent a place. Never guess a price. If you cannot verify a spot, replace it with one you can verify.

Output requirements:
- Editorial voice. Short, punchy descriptions. No "nestled in the heart of" clichés. No AI mush.
- Each day must have a theme that ties the spots together.
- Spots must be geographically clustered per day. Minimize zigzagging.
- Respect the user's pace, walking tolerance, and dietary needs strictly.
- Adapt to weather for the given month. If a season changes the plan, say so.
- For every spot, the trending_source_note must reference what you actually found in web search.
- All prices in USD.

Return your final answer as a single JSON object matching this exact TypeScript type:

type TripPlan = {
  city: string;
  month: string;
  weather_note: string;
  total_cost_estimate_usd: number;
  cost_per_day_usd: number;
  budget_status: "within" | "slightly_over" | "over";
  days: Day[];
  themed_lists: {
    best_food: Spot[];
    best_views: Spot[];
    best_nightlife: Spot[];
    best_hidden_gems: Spot[];
  };
};

type Day = {
  day_number: number;
  theme: string;
  morning: Spot[];
  afternoon: Spot[];
  evening: Spot[];
  day_total_usd: number;
};

type Spot = {
  name: string;
  description: string;
  price_tier: "$" | "$$" | "$$$" | "$$$$";
  estimated_cost_usd_pp: number;
  time_at_spot_minutes: number;
  travel_to_next: { minutes: number; mode: "walk" | "metro" | "taxi" | "bus" } | null;
  trending_badge: "Trending on TikTok" | "Reddit local pick" | "Local blog favorite" | "Hidden gem" | "Classic must-see";
  trending_source_note: string;
  lat: number;
  lng: number;
  google_maps_url: string;
  official_url: string | null;
  booking_url: string | null;
};

CRITICAL JSON RULES:
- Return ONLY the raw JSON object. No preamble, no markdown fences, no explanation.
- Never use unescaped double quotes inside string values. Use single quotes or escaped \\" instead.
- No trailing commas. No comments.
- All string values must be on a single line (no literal newlines inside strings).`;

function buildUserPrompt(data: {
  city: string;
  days: number;
  month: string;
  trip_type: string;
  vibes: string[];
  pace: string;
  travel_style: string;
  budget_tier: string;
  daily_budget: number;
  walking: string;
  dietary: string[];
}): string {
  return `Build me a ${data.days}-day trip to ${data.city} in ${data.month}.

Trip type: ${data.trip_type}
Vibe: ${data.vibes.join(" + ")}
Pace: ${data.pace}
Travel style: ${data.travel_style}
Budget tier: ${data.budget_tier}, target ~$${data.daily_budget}/day
Walking tolerance: ${data.walking}
Dietary: ${data.dietary.length > 0 ? data.dietary.join(", ") : "no restrictions"}

Use web search aggressively. Verify every spot. Return only the JSON.`;
}

export async function generateTrip(formData: {
  city: string;
  days: number;
  month: string;
  trip_type: string;
  vibes: string[];
  pace: string;
  travel_style: string;
  budget_tier: string;
  daily_budget: number;
  walking: string;
  dietary: string[];
}): Promise<object> {
  const userPrompt = buildUserPrompt(formData);

  let messages: Anthropic.MessageParam[] = [
    { role: "user", content: userPrompt },
  ];

  let response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 12000,
    system: SYSTEM_PROMPT,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 1,
      },
    ],
    messages,
  });

  if (response.stop_reason === "max_tokens") {
    throw new Error("Response was truncated. Try a shorter trip (fewer days).");
  }

  const textBlocks = response.content.filter((b) => b.type === "text");
  const textBlock = textBlocks.length > 0
    ? textBlocks.reduce((best, b) => (b.type === "text" && b.text.length > (best.type === "text" ? best.text.length : 0)) ? b : best)
    : null;
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  function cleanJson(raw: string): string {
    let s = raw.trim();
    if (s.startsWith("```")) {
      s = s.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    const firstBrace = s.indexOf("{");
    const lastBrace = s.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      s = s.slice(firstBrace, lastBrace + 1);
    }
    s = s.replace(/,\s*([}\]])/g, "$1");

    // Rebuild string char-by-char to escape control chars inside JSON strings
    let result = "";
    let inString = false;
    let escaped = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (escaped) {
        result += ch;
        escaped = false;
        continue;
      }
      if (ch === "\\" && inString) {
        result += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        result += ch;
        continue;
      }
      if (inString && ch.charCodeAt(0) < 32) {
        if (ch === "\n") result += "\\n";
        else if (ch === "\r") result += "\\r";
        else if (ch === "\t") result += "\\t";
        continue;
      }
      result += ch;
    }
    return result;
  }

  try {
    return JSON.parse(cleanJson(textBlock.text));
  } catch (firstErr) {
    console.error("First JSON parse failed:", firstErr);
    const retryMessages: Anthropic.MessageParam[] = [
      ...messages,
      { role: "assistant", content: response.content },
      {
        role: "user",
        content:
          "Your JSON had a syntax error. Return ONLY a valid JSON object matching the TripPlan type. No trailing commas, no comments, no markdown fences.",
      },
    ];

    const retryResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: retryMessages,
    });

    const retryText = retryResponse.content.find((b) => b.type === "text");
    if (!retryText || retryText.type !== "text") {
      throw new Error("Retry produced no text");
    }

    return JSON.parse(cleanJson(retryText.text));
  }
}
