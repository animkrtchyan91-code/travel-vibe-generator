import { TripPlan } from "./types";

const store = new Map<string, TripPlan>();

export function setTrip(id: string, plan: TripPlan) {
  store.set(id, plan);
}

export function getTrip(id: string): TripPlan | undefined {
  return store.get(id);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
