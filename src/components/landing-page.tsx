"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { themes, THEME_IDS, type ThemeId } from "@/lib/themes";
import { useThemeContext } from "@/components/theme-provider";
import { ThemeDecoration } from "@/components/decorations";
import { cn } from "@/lib/utils";

function ThemePreviewCard({
  themeId,
  isActive,
  onClick,
}: {
  themeId: ThemeId;
  isActive: boolean;
  onClick: () => void;
}) {
  const t = themes[themeId];
  return (
    <button onClick={onClick} className="text-left w-full">
      <Card
        className={cn(
          "p-5 transition-all cursor-pointer border-border hover:shadow-md",
          isActive
            ? "ring-2 ring-primary shadow-lg scale-[1.03]"
            : "hover:scale-[1.02]"
        )}
      >
        <div className="flex gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-full border border-black/10"
            style={{ backgroundColor: t.previewColors.primary }}
          />
          <div
            className="w-7 h-7 rounded-full border border-black/10"
            style={{ backgroundColor: t.previewColors.secondary }}
          />
          <div
            className="w-7 h-7 rounded-full border border-black/10"
            style={{ backgroundColor: t.previewColors.accent }}
          />
        </div>
        <h3 className="font-medium text-foreground mb-1">{t.name}</h3>
        <p className="text-sm text-muted-foreground leading-snug">
          {t.description}
        </p>
      </Card>
    </button>
  );
}

export function LandingPage() {
  const { theme, setTheme } = useThemeContext();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <ThemeDecoration className="absolute top-10 right-10 w-40 h-40 opacity-20 rotate-12" />
      <ThemeDecoration className="absolute bottom-20 left-10 w-32 h-32 opacity-15 -rotate-12" />
      <ThemeDecoration size="small" className="absolute top-1/3 left-20 w-10 h-10 opacity-25" />
      <ThemeDecoration size="small" className="absolute bottom-1/4 right-24 w-8 h-8 opacity-20 rotate-45" />

      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 pointer-events-none" />

      {/* Hero */}
      <div className="relative z-10 text-center pt-24 pb-16 px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <ThemeDecoration size="small" className="w-10 h-10" />
          <h1 className="text-5xl font-bold text-foreground">Notepad</h1>
          <ThemeDecoration size="small" className="w-10 h-10" />
        </div>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          A calming, beautiful space for your thoughts. Choose a theme that fits
          your mood.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            <Link href="/notes">Try it now</Link>
          </Button>
          <Button asChild variant="outline" className="border-border px-8">
            <Link href="/register">Create Account</Link>
          </Button>
          <Button asChild variant="ghost" className="px-8">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Theme showcase */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-24">
        <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
          Choose Your Vibe
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Click a theme to preview it live
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {THEME_IDS.map((id) => (
            <ThemePreviewCard
              key={id}
              themeId={id}
              isActive={theme === id}
              onClick={() => setTheme(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
