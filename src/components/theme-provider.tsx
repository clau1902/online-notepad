"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { THEME_IDS, DEFAULT_THEME, type ThemeId } from "@/lib/themes";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeId;
  persistToServer?: boolean;
}

export function ThemeProvider({
  children,
  initialTheme = DEFAULT_THEME,
  persistToServer = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "midnight") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: ThemeId) => {
      if (!THEME_IDS.includes(newTheme)) return;
      setThemeState(newTheme);

      if (persistToServer) {
        fetch("/api/user/theme", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme }),
        }).catch(() => {});
      }
    },
    [persistToServer]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
