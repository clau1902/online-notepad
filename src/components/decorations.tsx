"use client";

import { useThemeContext } from "@/components/theme-provider";
import { FlowerDecoration, SmallFlower } from "@/components/flower-decoration";

// ── Ocean: Wave ─────────────────────────────────────────────────

export function WaveDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20 100 Q50 60 80 100 T140 100 T200 100" fill="none" style={{ stroke: "var(--secondary)" }} strokeWidth="8" opacity="0.5" />
      <path d="M10 130 Q40 90 70 130 T130 130 T190 130" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="6" opacity="0.4" />
      <path d="M30 160 Q60 120 90 160 T150 160 T210 160" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="4" opacity="0.3" />
      <circle cx="50" cy="50" r="6" style={{ fill: "var(--primary)" }} opacity="0.3" />
      <circle cx="160" cy="40" r="4" style={{ fill: "var(--accent)" }} opacity="0.4" />
      <circle cx="120" cy="70" r="5" style={{ fill: "var(--secondary)" }} opacity="0.3" />
    </svg>
  );
}

export function SmallWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 20 Q12 10 20 20 T35 20" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="3" opacity="0.6" strokeLinecap="round" />
      <path d="M8 28 Q15 18 22 28 T36 28" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

// ── Sunset: Sun ─────────────────────────────────────────────────

export function SunDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="35" style={{ fill: "var(--primary)" }} opacity="0.4" />
      <circle cx="100" cy="100" r="25" style={{ fill: "var(--accent)" }} opacity="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="100" y1="100"
          x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
          style={{ stroke: "var(--secondary)" }}
          strokeWidth="4"
          opacity="0.3"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function SmallSun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="8" style={{ fill: "var(--primary)" }} opacity="0.5" />
      <circle cx="20" cy="20" r="5" style={{ fill: "var(--accent)" }} opacity="0.6" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1="20" y1="20"
          x2={20 + 15 * Math.cos((angle * Math.PI) / 180)}
          y2={20 + 15 * Math.sin((angle * Math.PI) / 180)}
          style={{ stroke: "var(--secondary)" }}
          strokeWidth="2"
          opacity="0.4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

// ── Forest: Tree ────────────────────────────────────────────────

export function TreeDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="92" y="130" width="16" height="50" rx="3" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <polygon points="100,30 60,100 140,100" style={{ fill: "var(--primary)" }} opacity="0.4" />
      <polygon points="100,55 65,115 135,115" style={{ fill: "var(--secondary)" }} opacity="0.5" />
      <polygon points="100,75 70,130 130,130" style={{ fill: "var(--accent)" }} opacity="0.4" />
      <circle cx="45" cy="160" r="8" style={{ fill: "var(--secondary)" }} opacity="0.3" />
      <circle cx="155" cy="155" r="6" style={{ fill: "var(--secondary)" }} opacity="0.3" />
    </svg>
  );
}

export function SmallTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="17" y="26" width="6" height="10" rx="1" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <polygon points="20,6 10,22 30,22" style={{ fill: "var(--primary)" }} opacity="0.5" />
      <polygon points="20,12 12,26 28,26" style={{ fill: "var(--secondary)" }} opacity="0.4" />
    </svg>
  );
}

// ── Midnight: Star ──────────────────────────────────────────────

export function StarDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Big star */}
      <polygon
        points="100,20 112,75 170,75 122,110 138,165 100,135 62,165 78,110 30,75 88,75"
        style={{ fill: "var(--primary)" }}
        opacity="0.45"
      />
      {/* Medium 4-point stars */}
      <polygon points="40,40 43,35 46,40 43,45" style={{ fill: "var(--accent)" }} opacity="0.7" />
      <polygon points="165,55 168,50 171,55 168,60" style={{ fill: "var(--primary)" }} opacity="0.5" />
      <polygon points="25,120 28,115 31,120 28,125" style={{ fill: "var(--accent)" }} opacity="0.55" />
      <polygon points="170,140 173,135 176,140 173,145" style={{ fill: "var(--primary)" }} opacity="0.45" />
      {/* Bright dot stars */}
      <circle cx="55" cy="18" r="2.5" style={{ fill: "var(--accent)" }} opacity="0.7" />
      <circle cx="160" cy="25" r="2" style={{ fill: "var(--primary)" }} opacity="0.65" />
      <circle cx="185" cy="75" r="2.5" style={{ fill: "var(--accent)" }} opacity="0.55" />
      <circle cx="12" cy="85" r="2" style={{ fill: "var(--primary)" }} opacity="0.6" />
      <circle cx="175" cy="170" r="2" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <circle cx="55" cy="170" r="2.5" style={{ fill: "var(--primary)" }} opacity="0.55" />
      <circle cx="130" cy="18" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.65" />
      <circle cx="20" cy="55" r="1.5" style={{ fill: "var(--primary)" }} opacity="0.5" />
      {/* Tiny twinkle stars */}
      <circle cx="80" cy="10" r="1" style={{ fill: "var(--accent)" }} opacity="0.7" />
      <circle cx="145" cy="42" r="1" style={{ fill: "var(--primary)" }} opacity="0.6" />
      <circle cx="190" cy="50" r="1" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <circle cx="8" cy="40" r="1" style={{ fill: "var(--primary)" }} opacity="0.55" />
      <circle cx="190" cy="120" r="1" style={{ fill: "var(--accent)" }} opacity="0.45" />
      <circle cx="10" cy="170" r="1" style={{ fill: "var(--primary)" }} opacity="0.5" />
      <circle cx="90" cy="185" r="1" style={{ fill: "var(--accent)" }} opacity="0.55" />
      <circle cx="140" cy="185" r="1" style={{ fill: "var(--primary)" }} opacity="0.45" />
      <circle cx="30" cy="145" r="1" style={{ fill: "var(--accent)" }} opacity="0.6" />
      <circle cx="180" cy="155" r="1" style={{ fill: "var(--primary)" }} opacity="0.5" />
      <circle cx="70" cy="5" r="1" style={{ fill: "var(--primary)" }} opacity="0.4" />
      <circle cx="115" cy="190" r="1" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <circle cx="5" cy="105" r="1" style={{ fill: "var(--accent)" }} opacity="0.4" />
      <circle cx="195" cy="95" r="1" style={{ fill: "var(--primary)" }} opacity="0.35" />
    </svg>
  );
}

export function SmallStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="20,5 23,15 33,15 25,21 28,32 20,25 12,32 15,21 7,15 17,15"
        style={{ fill: "var(--primary)" }}
        opacity="0.55"
      />
      {/* 4-point sparkle */}
      <polygon points="8,8 9,6 10,8 9,10" style={{ fill: "var(--accent)" }} opacity="0.7" />
      {/* Dot stars */}
      <circle cx="34" cy="6" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.65" />
      <circle cx="4" cy="28" r="1" style={{ fill: "var(--primary)" }} opacity="0.55" />
      <circle cx="36" cy="32" r="1" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <circle cx="6" cy="16" r="0.8" style={{ fill: "var(--primary)" }} opacity="0.45" />
      <circle cx="34" cy="20" r="0.8" style={{ fill: "var(--accent)" }} opacity="0.4" />
      <circle cx="16" cy="38" r="0.8" style={{ fill: "var(--primary)" }} opacity="0.5" />
    </svg>
  );
}

// ── Unified decoration switcher ─────────────────────────────────

export function ThemeDecoration({
  className,
  size = "large",
}: {
  className?: string;
  size?: "large" | "small";
}) {
  const { theme } = useThemeContext();

  switch (theme) {
    case "ocean":
      return size === "large" ? <WaveDecoration className={className} /> : <SmallWave className={className} />;
    case "sunset":
      return size === "large" ? <SunDecoration className={className} /> : <SmallSun className={className} />;
    case "forest":
      return size === "large" ? <TreeDecoration className={className} /> : <SmallTree className={className} />;
    case "midnight":
      return size === "large" ? <StarDecoration className={className} /> : <SmallStar className={className} />;
    case "flower":
    default:
      return size === "large" ? <FlowerDecoration className={className} /> : <SmallFlower className={className} />;
  }
}
