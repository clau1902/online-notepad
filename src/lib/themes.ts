export const THEME_IDS = ["flower", "ocean", "sunset", "forest", "midnight"] as const;
export type ThemeId = (typeof THEME_IDS)[number];
export const DEFAULT_THEME: ThemeId = "flower";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  flower: {
    id: "flower",
    name: "Flower",
    description: "Soft purples and pinks with botanical accents",
    previewColors: {
      primary: "#A78BCC",
      secondary: "#F0CFDA",
      accent: "#C8E0D0",
      background: "#FAF8F5",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    description: "Cool blues and teals inspired by the sea",
    previewColors: {
      primary: "#5B9BD5",
      secondary: "#B8D8E8",
      accent: "#7EC8C8",
      background: "#F5F9FC",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    description: "Warm oranges and corals like a golden hour sky",
    previewColors: {
      primary: "#E07850",
      secondary: "#F5C49C",
      accent: "#F0A080",
      background: "#FDF8F5",
    },
  },
  forest: {
    id: "forest",
    name: "Forest",
    description: "Deep greens and earthy tones from the woodland",
    previewColors: {
      primary: "#5A8A6A",
      secondary: "#C4D8B8",
      accent: "#8AB89A",
      background: "#F5F8F5",
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Rich purples and blues for a dark, calming experience",
    previewColors: {
      primary: "#8B7BC8",
      secondary: "#2A2540",
      accent: "#6A5ACD",
      background: "#1A1625",
    },
  },
};
