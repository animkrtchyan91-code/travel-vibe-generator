"use client";

import { useEffect, useRef, useState } from "react";

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const isTouch = matchMedia("(hover: none)").matches;
    if (isTouch) return;

    setHidden(false);
    let raf = 0;
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.left = `${e.clientX}px`;
          ref.current.style.top = `${e.clientY}px`;
        }
      });
    };
    const handleLeave = () => setHidden(true);
    const handleEnter = () => setHidden(false);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="spotlight"
      style={{ opacity: hidden ? 0 : 1 }}
    />
  );
}
