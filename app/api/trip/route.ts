import { NextRequest } from "next/server";
import { getTrip } from "@/lib/cache";
import { sampleTrip } from "@/lib/sample-output";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("id");
  const demo = searchParams.get("demo");

  if (demo === "1") {
    return Response.json(sampleTrip);
  }

  if (!id) {
    return Response.json({ error: "Missing trip ID" }, { status: 400 });
  }

  const trip = getTrip(id);
  if (!trip) {
    return Response.json(
      { error: "Trip not found. It may have expired." },
      { status: 404 }
    );
  }

  return Response.json(trip);
}
