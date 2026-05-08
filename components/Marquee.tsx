"use client";

import React from "react";

export default function Marquee({
  children,
  speed = "normal",
  reverse = false,
  className = "",
  separator = "✦",
  separatorClassName = "",
}: {
  children: React.ReactNode;
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  className?: string;
  separator?: string;
  separatorClassName?: string;
}) {
  const items = React.Children.toArray(children);
  const duration = speed === "fast" ? "22s" : speed === "slow" ? "60s" : "40s";

  const renderRow = (key: string) => (
    <div key={key} className="flex items-center shrink-0 whitespace-nowrap">
      {items.map((child, i) => (
        <span key={i} className="flex items-center shrink-0 whitespace-nowrap">
          {child}
          <span className={`mx-5 inline-block shrink-0 ${separatorClassName}`}>{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${duration} linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {renderRow("a")}
        {renderRow("b")}
      </div>
    </div>
  );
}
