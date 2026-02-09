"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeDecoration } from "@/components/decorations";

interface GuestSignupPromptProps {
  noteCount: number;
}

export function GuestSignupPrompt({ noteCount }: GuestSignupPromptProps) {
  // Browser-level prompt on tab close
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 pointer-events-none">
      <div className="mx-auto max-w-lg pointer-events-auto">
        <div className="rounded-xl border border-border bg-card shadow-lg p-4 flex items-center gap-4">
          <ThemeDecoration size="small" className="h-10 w-10 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              You have {noteCount} {noteCount === 1 ? "note" : "notes"} in guest
              mode
            </p>
            <p className="text-xs text-muted-foreground">
              Sign up to save them permanently
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
          >
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
