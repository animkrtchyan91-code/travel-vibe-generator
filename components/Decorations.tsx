export function Squiggle({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 8 Q 12 2, 22 8 T 42 8 T 62 8 T 82 8 T 102 8 T 118 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Arrow({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 18 Q 18 4, 36 14 T 56 12 M 50 6 L 56 12 L 50 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Star({ className = "", color = "currentColor", size = 24 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 L13.8 9.5 L21.5 10 L15.5 14.8 L17.5 22 L12 17.5 L6.5 22 L8.5 14.8 L2.5 10 L10.2 9.5 Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.15"
      />
    </svg>
  );
}

export function Sparkle({ className = "", color = "currentColor", size = 16 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 L13 11 L22 12 L13 13 L12 22 L11 13 L2 12 L11 11 Z"
        fill={color}
      />
    </svg>
  );
}

export function Burst({ className = "", color = "currentColor", size = 60 }: { className?: string; color?: string; size?: number }) {
  const lines = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const x1 = 30 + Math.cos(angle) * 12;
    const y1 = 30 + Math.sin(angle) * 12;
    const x2 = 30 + Math.cos(angle) * 26;
    const y2 = 30 + Math.sin(angle) * 26;
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />;
  });
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {lines}
    </svg>
  );
}

export function Plus({ className = "", color = "currentColor", size = 16 }: { className?: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4 L12 20 M4 12 L20 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
