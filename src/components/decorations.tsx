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
        opacity="0.4"
      />
      {/* Small stars */}
      <circle cx="40" cy="40" r="3" style={{ fill: "var(--accent)" }} opacity="0.6" />
      <circle cx="165" cy="35" r="2" style={{ fill: "var(--secondary)" }} opacity="0.5" />
      <circle cx="155" cy="160" r="3" style={{ fill: "var(--accent)" }} opacity="0.4" />
      <circle cx="30" cy="150" r="2" style={{ fill: "var(--secondary)" }} opacity="0.5" />
      <circle cx="75" cy="175" r="2" style={{ fill: "var(--accent)" }} opacity="0.3" />
      <circle cx="140" cy="20" r="2" style={{ fill: "var(--accent)" }} opacity="0.5" />
      <circle cx="60" cy="25" r="1.5" style={{ fill: "var(--secondary)" }} opacity="0.4" />
      <circle cx="180" cy="100" r="2" style={{ fill: "var(--accent)" }} opacity="0.3" />
    </svg>
  );
}

export function SmallStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="20,5 23,15 33,15 25,21 28,32 20,25 12,32 15,21 7,15 17,15"
        style={{ fill: "var(--primary)" }}
        opacity="0.5"
      />
      <circle cx="8" cy="8" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.6" />
      <circle cx="34" cy="6" r="1" style={{ fill: "var(--secondary)" }} opacity="0.5" />
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
