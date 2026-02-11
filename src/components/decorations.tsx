"use client";

import { useThemeContext } from "@/components/theme-provider";
import { FlowerDecoration, SmallFlower } from "@/components/flower-decoration";

// ── Ocean: Wave ─────────────────────────────────────────────────

export function WaveDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Organic wave crests */}
      <path
        d="M-5 105 C18 82, 42 78, 68 95 C94 112, 108 96, 135 84 C158 74, 178 82, 205 95"
        fill="none"
        style={{ stroke: "var(--secondary)" }}
        strokeWidth="3"
        opacity="0.45"
        strokeLinecap="round"
      />
      <path
        d="M-5 128 C22 110, 50 104, 80 118 C110 132, 125 115, 155 106 C178 99, 192 108, 210 120"
        fill="none"
        style={{ stroke: "var(--primary)" }}
        strokeWidth="2.5"
        opacity="0.4"
        strokeLinecap="round"
      />
      <path
        d="M-5 152 C20 140, 48 135, 72 146 C96 157, 115 143, 145 136 C168 131, 188 140, 210 148"
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="2"
        opacity="0.35"
        strokeLinecap="round"
      />
      {/* Seafoam dots */}
      <circle cx="72" cy="90" r="2.5" style={{ fill: "var(--primary)" }} opacity="0.35" />
      <circle cx="82" cy="86" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.3" />
      <circle cx="140" cy="80" r="2" style={{ fill: "var(--secondary)" }} opacity="0.3" />
      <circle cx="148" cy="76" r="1.2" style={{ fill: "var(--primary)" }} opacity="0.25" />
      <circle cx="40" cy="50" r="5" style={{ fill: "var(--primary)" }} opacity="0.2" />
      <circle cx="155" cy="45" r="3.5" style={{ fill: "var(--accent)" }} opacity="0.25" />
      <circle cx="100" cy="60" r="4" style={{ fill: "var(--secondary)" }} opacity="0.18" />
      {/* Tiny sparkle dots on water */}
      <circle cx="55" cy="100" r="1" style={{ fill: "var(--primary)" }} opacity="0.5" />
      <circle cx="115" cy="92" r="1" style={{ fill: "var(--accent)" }} opacity="0.45" />
      <circle cx="170" cy="100" r="1" style={{ fill: "var(--primary)" }} opacity="0.4" />
      <circle cx="30" cy="115" r="1" style={{ fill: "var(--secondary)" }} opacity="0.35" />
    </svg>
  );
}

export function SmallWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Organic crests */}
      <path
        d="M0 20 C6 13, 13 12, 20 18 C27 24, 32 18, 40 15"
        fill="none"
        style={{ stroke: "var(--primary)" }}
        strokeWidth="2"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M0 28 C7 22, 14 20, 22 25 C30 30, 34 26, 40 23"
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="1.5"
        opacity="0.35"
        strokeLinecap="round"
      />
      {/* Foam dots */}
      <circle cx="18" cy="15" r="1" style={{ fill: "var(--accent)" }} opacity="0.45" />
      <circle cx="32" cy="13" r="0.8" style={{ fill: "var(--primary)" }} opacity="0.35" />
    </svg>
  );
}

// ── Sunset: Sun ─────────────────────────────────────────────────

export function SunDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Half-sun sinking below horizon */}
      <clipPath id="sun-clip-lg">
        <rect x="0" y="0" width="200" height="120" />
      </clipPath>
      <circle cx="100" cy="120" r="38" style={{ fill: "var(--primary)" }} opacity="0.35" clipPath="url(#sun-clip-lg)" />
      <circle cx="100" cy="120" r="28" style={{ fill: "var(--accent)" }} opacity="0.3" clipPath="url(#sun-clip-lg)" />
      {/* Soft radiating arcs */}
      <path d="M40 120 A60 60 0 0 1 160 120" fill="none" style={{ stroke: "var(--secondary)" }} strokeWidth="2" opacity="0.25" />
      <path d="M25 120 A75 75 0 0 1 175 120" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="1.5" opacity="0.18" />
      <path d="M10 120 A90 90 0 0 1 190 120" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1" opacity="0.12" />
      {/* Horizon line */}
      <path
        d="M5 120 C35 120, 65 120, 100 120 C135 120, 165 120, 195 120"
        fill="none"
        style={{ stroke: "var(--primary)" }}
        strokeWidth="1.5"
        opacity="0.3"
        strokeLinecap="round"
      />
      {/* Warm reflection below horizon */}
      <path d="M55 132 C70 128, 85 126, 100 126 C115 126, 130 128, 145 132" fill="none" style={{ stroke: "var(--secondary)" }} strokeWidth="2.5" opacity="0.2" strokeLinecap="round" />
      <path d="M65 142 C78 139, 90 138, 100 138 C110 138, 122 139, 135 142" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="2" opacity="0.15" strokeLinecap="round" />
      <path d="M75 152 C85 150, 93 149, 100 149 C107 149, 115 150, 125 152" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="1.5" opacity="0.1" strokeLinecap="round" />
      {/* Warm sky particles */}
      <circle cx="50" cy="65" r="2" style={{ fill: "var(--secondary)" }} opacity="0.2" />
      <circle cx="150" cy="58" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.2" />
      <circle cx="80" cy="45" r="1.5" style={{ fill: "var(--primary)" }} opacity="0.15" />
      <circle cx="125" cy="40" r="1" style={{ fill: "var(--secondary)" }} opacity="0.15" />
      <circle cx="35" cy="90" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.15" />
      <circle cx="168" cy="95" r="1" style={{ fill: "var(--primary)" }} opacity="0.12" />
      {/* Distant birds — simple v-shapes */}
      <path d="M45 50 L48 47 L51 50" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="1" opacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M55 42 L57 40 L59 42" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="0.8" opacity="0.15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M140 48 L143 45 L146 48" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1" opacity="0.18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SmallSun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Half-sun */}
      <clipPath id="sun-clip-sm">
        <rect x="0" y="0" width="40" height="24" />
      </clipPath>
      <circle cx="20" cy="24" r="9" style={{ fill: "var(--primary)" }} opacity="0.4" clipPath="url(#sun-clip-sm)" />
      <circle cx="20" cy="24" r="6" style={{ fill: "var(--accent)" }} opacity="0.35" clipPath="url(#sun-clip-sm)" />
      {/* Radiating arc */}
      <path d="M6 24 A14 14 0 0 1 34 24" fill="none" style={{ stroke: "var(--secondary)" }} strokeWidth="1" opacity="0.25" />
      {/* Horizon */}
      <path d="M2 24 L38 24" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      {/* Reflection */}
      <path d="M12 28 C15 26.5, 18 26, 20 26 C22 26, 25 26.5, 28 28" fill="none" style={{ stroke: "var(--secondary)" }} strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      {/* Bird */}
      <path d="M10 12 L12 10 L14 12" fill="none" style={{ stroke: "var(--primary)" }} strokeWidth="0.7" opacity="0.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Forest: Leaf ────────────────────────────────────────────────

export function LeafDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Main leaf */}
      <path
        d="M100,30 Q140,60 145,110 Q130,140 100,170 Q70,140 55,110 Q60,60 100,30Z"
        style={{ fill: "var(--primary)" }}
        opacity="0.35"
      />
      {/* Leaf center vein */}
      <path
        d="M100,40 Q100,100 100,165"
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="2"
        opacity="0.5"
      />
      {/* Side veins */}
      <path d="M100,65 Q120,60 135,75" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" opacity="0.35" />
      <path d="M100,65 Q80,60 65,75" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" opacity="0.35" />
      <path d="M100,90 Q125,85 140,100" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" opacity="0.3" />
      <path d="M100,90 Q75,85 60,100" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" opacity="0.3" />
      <path d="M100,115 Q122,112 135,122" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" opacity="0.25" />
      <path d="M100,115 Q78,112 65,122" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.5" opacity="0.25" />
      <path d="M100,140 Q115,138 125,145" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1" opacity="0.2" />
      <path d="M100,140 Q85,138 75,145" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1" opacity="0.2" />
      {/* Small floating leaves */}
      <path d="M35,45 Q45,35 55,45 Q45,55 35,45Z" style={{ fill: "var(--secondary)" }} opacity="0.4" />
      <path d="M155,40 Q162,32 170,40 Q162,48 155,40Z" style={{ fill: "var(--accent)" }} opacity="0.35" />
      <path d="M30,155 Q38,148 46,155 Q38,162 30,155Z" style={{ fill: "var(--accent)" }} opacity="0.3" />
      <path d="M160,160 Q166,154 172,160 Q166,166 160,160Z" style={{ fill: "var(--secondary)" }} opacity="0.35" />
      <path d="M165,105 Q170,100 175,105 Q170,110 165,105Z" style={{ fill: "var(--primary)" }} opacity="0.25" />
      {/* Tiny dots like dew */}
      <circle cx="42" cy="100" r="2" style={{ fill: "var(--secondary)" }} opacity="0.35" />
      <circle cx="158" cy="85" r="1.5" style={{ fill: "var(--secondary)" }} opacity="0.3" />
      <circle cx="25" cy="80" r="1.5" style={{ fill: "var(--accent)" }} opacity="0.25" />
      <circle cx="175" cy="135" r="1.5" style={{ fill: "var(--primary)" }} opacity="0.2" />
    </svg>
  );
}

export function SmallLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Small leaf shape */}
      <path
        d="M20,5 Q30,12 31,22 Q27,30 20,36 Q13,30 9,22 Q10,12 20,5Z"
        style={{ fill: "var(--primary)" }}
        opacity="0.4"
      />
      {/* Center vein */}
      <path d="M20,8 L20,34" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1" opacity="0.5" />
      {/* Side veins */}
      <path d="M20,14 Q26,12 29,16" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="0.8" opacity="0.3" />
      <path d="M20,14 Q14,12 11,16" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="0.8" opacity="0.3" />
      <path d="M20,22 Q25,21 28,24" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="0.8" opacity="0.25" />
      <path d="M20,22 Q15,21 12,24" fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="0.8" opacity="0.25" />
      {/* Tiny floating leaf */}
      <path d="M5,10 Q8,7 11,10 Q8,13 5,10Z" style={{ fill: "var(--secondary)" }} opacity="0.4" />
      <circle cx="34" cy="8" r="1" style={{ fill: "var(--accent)" }} opacity="0.35" />
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
      return size === "large" ? <LeafDecoration className={className} /> : <SmallLeaf className={className} />;
    case "midnight":
      return size === "large" ? <StarDecoration className={className} /> : <SmallStar className={className} />;
    case "flower":
    default:
      return size === "large" ? <FlowerDecoration className={className} /> : <SmallFlower className={className} />;
  }
}
