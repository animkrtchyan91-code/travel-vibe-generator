# TRAVEL VIBE GENERATOR

AI-powered hyper-specific travel plans. Built with Claude × HUVA.

Takes your trip inputs and returns a web-search-verified, day-by-day travel plan using the Claude API with real-time web search.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- TailwindCSS v4
- Anthropic SDK (`claude-sonnet-4-5`) with `web_search` tool
- Leaflet + react-leaflet + OpenStreetMap (CartoDB dark tiles)
- Fonts: Space Grotesk + Archivo Black

## Setup

```bash
git clone <repo-url>
cd travel-vibe-generator
npm install
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key (server-side only) |

## Demo Mode

Add `?demo=1` to the trip page URL to load the cached Lisbon sample without calling the API:

```
http://localhost:3000/trip?demo=1
```

This is useful for filming reels and testing UI without burning API credits.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com), click "Import Project", select the repo
3. Add environment variable: `ANTHROPIC_API_KEY` = your key
4. Deploy
5. App is live at `<project-name>.vercel.app`

**Note:** Free Vercel tier caps function execution at 60s. If a generation takes longer, the API route will time out. For longer generations, upgrade to Vercel Pro and bump `maxDuration` to 90 in `vercel.json`.

## Add to Home Screen (iOS Filming)

For filming Instagram reels on iPhone:

1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Name it "TRAVEL VIBE"
5. The app launches full-screen with black status bar

## Architecture

```
/app
  layout.tsx          - Global layout, fonts, black background
  page.tsx            - Input form (Screen 1)
  /trip/page.tsx      - Results page (Screen 3)
  /api/generate       - POST endpoint, calls Claude with web_search
  /api/trip           - GET endpoint, returns cached trip or demo data
/components           - InputForm, LoadingState, DayCard, SpotCard, etc.
/lib
  claude.ts           - Claude API client with web_search tool loop
  types.ts            - TypeScript types
  cache.ts            - In-memory Map for storing trips by ID
  sample-output.ts    - Cached Lisbon demo data
```

Flow: form submit on `/` → POST `/api/generate` → Claude with web search → store in memory → redirect to `/trip?id=xxx` → render results.

In-memory cache resets on cold start. No database, no user accounts.
