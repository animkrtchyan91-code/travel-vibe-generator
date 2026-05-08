"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "searching real prices...",
  "checking tiktok and reddit recommendations...",
  "cross-referencing with local blogs...",
  "verifying spots are still open...",
  "building your day-by-day...",
  "pinning everything to the map...",
];

const PHOTOS = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
  "https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
];

export default function LoadingState() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [photoVisible, setPhotoVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        setMsgVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const photoInterval = setInterval(() => {
      setPhotoVisible(false);
      setTimeout(() => {
        setPhotoIndex((prev) => (prev + 1) % PHOTOS.length);
        setPhotoVisible(true);
      }, 800);
    }, 5000);
    return () => clearInterval(photoInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev + 0.1;
        if (prev >= 70) return prev + 0.3;
        return prev + 1.2;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-midnight flex flex-col grain">
      {/* Rotating background photo with crossfade */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            photoVisible ? "opacity-25 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url('${PHOTOS[photoIndex]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-transparent to-midnight" />
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        {/* Animated orb */}
        <div className="relative mb-10">
          <div className="w-16 h-16 rounded-full border border-flamingo/20 flex items-center justify-center">
            <div className="w-3 h-3 bg-flamingo pulse-square" />
          </div>
          <div className="absolute inset-0 rounded-full border border-flamingo/10 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        {/* Status message */}
        <p
          className={`font-serif text-[18px] italic text-canvas/80 text-center transition-all duration-500 leading-[1.4] max-w-[260px] ${
            msgVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {MESSAGES[msgIndex]}
        </p>

        {/* Progress bar */}
        <div className="mt-10 w-48">
          <div className="h-[1px] bg-canvas/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-flamingo/60 to-flamingo transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 95)}%` }}
            />
          </div>
          <p className="font-condensed text-[10px] text-placeholder/30 text-center mt-3 tracking-[0.2em] uppercase">
            Generating your trip
          </p>
        </div>
      </div>
    </div>
  );
}
