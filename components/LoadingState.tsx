"use client";

import { useState, useEffect } from "react";
import Marquee from "./Marquee";
import { Burst, Star, Sparkle } from "./Decorations";

const MESSAGES = [
  "searching real prices...",
  "checking tiktok and reddit recommendations...",
  "cross-referencing with local blogs...",
  "verifying spots are still open...",
  "building your day-by-day...",
  "pinning everything to the map...",
];

const PHOTOS = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=85",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=85",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=1200&q=85",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [photoVisible, setPhotoVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((p) => (p + 1) % MESSAGES.length);
        setMsgVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setPhotoVisible(false);
      setTimeout(() => {
        setPhotoIndex((p) => (p + 1) % PHOTOS.length);
        setPhotoVisible(true);
      }, 800);
    }, 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p + 0.05;
        if (p >= 75) return p + 0.2;
        return p + 1;
      });
    }, 320);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-midnight grain flex flex-col">
      {/* Top marquee */}
      <div className="bg-canvas text-midnight border-b border-midnight py-2.5 overflow-hidden shrink-0">
        <Marquee speed="fast" separator="✦" separatorClassName="text-sunset">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">Generating your trip</span>
          <span className="font-display italic text-[18px]">Hold tight — verifying every spot</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">~60 seconds</span>
        </Marquee>
      </div>

      {/* Main content */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background photo */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            photoVisible ? "opacity-30 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url('${PHOTOS[photoIndex]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/30 to-midnight" />

        {/* Floating decorations */}
        <div className="absolute top-12 right-12 spin-slow opacity-60">
          <Burst color="var(--color-flamingo)" size={56} />
        </div>
        <div className="absolute top-24 left-10 spin-medium opacity-60">
          <Star size={28} color="var(--color-goldenrod)" />
        </div>
        <div className="absolute bottom-32 right-16 opacity-50">
          <Sparkle size={20} color="var(--color-sunset)" />
        </div>
        <div className="absolute bottom-48 left-20 opacity-40 spin-slow" style={{ animationDirection: "reverse" }}>
          <Burst color="var(--color-sunset)" size={32} />
        </div>

        {/* Center content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 max-w-md mx-auto">
          {/* Big animated visual */}
          <div className="relative mb-12">
            <div className="w-24 h-24 rounded-full border-2 border-flamingo/30 flex items-center justify-center spin-slow">
              <div className="w-3.5 h-3.5 bg-flamingo pulse-square" />
            </div>
            <div className="absolute inset-0 rounded-full border border-flamingo/15 animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute -inset-4 rounded-full border border-flamingo/8 spin-slow" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
          </div>

          {/* Eyebrow */}
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-flamingo mb-4">
            ✶ Now generating
          </p>

          {/* Status message */}
          <div className="h-20 flex items-center">
            <p
              className={`font-display italic text-[28px] text-canvas text-center transition-all duration-500 leading-[1.15] tracking-tight ${
                msgVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              {MESSAGES[msgIndex]}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-12 w-full max-w-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-canvas/40">
                Progress
              </span>
              <span className="font-mono text-[10px] tabular-nums text-flamingo">
                {Math.floor(Math.min(progress, 95))}%
              </span>
            </div>
            <div className="h-[2px] bg-canvas/8 overflow-hidden">
              <div
                className="h-full bg-flamingo transition-all duration-300 ease-out shimmer-line"
                style={{ width: `${Math.min(progress, 95)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="bg-flamingo text-midnight border-t border-midnight py-2.5 overflow-hidden shrink-0">
        <Marquee speed="slow" reverse separator="◆" separatorClassName="text-sunset">
          <span className="font-display italic text-[16px]">Built with Claude × HUVA</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Verified spots only</span>
          <span className="font-display italic text-[16px]">Real prices · Real recs</span>
        </Marquee>
      </div>
    </div>
  );
}
