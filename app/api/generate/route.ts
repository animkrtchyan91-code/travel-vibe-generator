import { NextRequest } from "next/server";
import { generateTrip } from "@/lib/claude";
import { TripPlan } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      city,
      days,
      trip_type,
      vibes,
      pace,
      travel_style,
      budget_tier,
      daily_budget,
      walking,
      dietary,
      month,
    } = body;

    if (!city || !days || !month) {
      return Response.json(
        { error: "Missing required fields: city, days, month" },
        { status: 400 }
      );
    }

    const result = await generateTrip({
      city,
      days: Number(days),
      month,
      trip_type: trip_type || "first_time",
      vibes: vibes || [],
      pace: pace || "balanced",
      travel_style: travel_style || "solo",
      budget_tier: budget_tier || "mid",
      daily_budget: Number(daily_budget) || 100,
      walking: walking || "moderate",
      dietary: dietary || [],
    });

    return Response.json({ trip: result as TripPlan });
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate trip",
      },
      { status: 500 }
    );
  }
}
