"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Plus, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { Note } from "@/components/note-card";
import type { Notebook } from "@/lib/types";

interface NotebookShelfProps {
  notebooks: Notebook[];
  notes: Note[];
  activeNotebookId: string | null;
  onSelectNotebook: (id: string | null) => void;
  onCreateNotebook: () => void;
}

/*
 * Theme-derived covers: each book uses a theme CSS variable as
 * its base colour, then a dark overlay deepens it into a rich
 * "leather" shade. 18 unique combinations so every book on the
 * shelf gets its own distinct tone.
 */
const leatherCovers = [
  // ── primary family ─────────────────────────────────────────
  { base: "bg-primary",      ring: "ring-primary/40",    overlay: 0.30 },
  { base: "bg-primary/80",   ring: "ring-primary/35",    overlay: 0.40 },
  { base: "bg-primary/60",   ring: "ring-primary/25",    overlay: 0.22 },
  // ── secondary family ───────────────────────────────────────
  { base: "bg-secondary",    ring: "ring-secondary/40",  overlay: 0.26 },
  { base: "bg-secondary/80", ring: "ring-secondary/35",  overlay: 0.36 },
  { base: "bg-secondary/60", ring: "ring-secondary/25",  overlay: 0.18 },
  // ── accent family ──────────────────────────────────────────
  { base: "bg-accent",       ring: "ring-accent/40",     overlay: 0.28 },
  { base: "bg-accent/80",    ring: "ring-accent/35",     overlay: 0.38 },
  { base: "bg-accent/60",    ring: "ring-accent/25",     overlay: 0.20 },
  // ── muted family ───────────────────────────────────────────
  { base: "bg-muted",        ring: "ring-muted-foreground/30", overlay: 0.24 },
  { base: "bg-muted/80",     ring: "ring-muted-foreground/25", overlay: 0.34 },
  // ── destructive tint ───────────────────────────────────────
  { base: "bg-destructive/70", ring: "ring-destructive/30", overlay: 0.32 },
  // ── cross-mixes (deeper/lighter variants) ──────────────────
  { base: "bg-primary/90",   ring: "ring-primary/30",    overlay: 0.44 },
  { base: "bg-secondary/90", ring: "ring-secondary/30",  overlay: 0.42 },
  { base: "bg-accent/90",    ring: "ring-accent/30",     overlay: 0.46 },
  { base: "bg-primary/50",   ring: "ring-primary/20",    overlay: 0.16 },
  { base: "bg-secondary/50", ring: "ring-secondary/20",  overlay: 0.14 },
  { base: "bg-accent/50",    ring: "ring-accent/20",     overlay: 0.12 },
];

/* Varying heights — like real books on a shelf */
const bookHeights = [118, 126, 112, 124, 116, 128, 110, 122];

export function NotebookShelf({
  notebooks,
  notes,
  activeNotebookId,
  onSelectNotebook,
  onCreateNotebook,
}: NotebookShelfProps) {
  const noteCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const note of notes) {
      if (note.notebookId) {
        counts[note.notebookId] = (counts[note.notebookId] || 0) + 1;
      }
    }
    return counts;
  }, [notes]);

  /* More notes → thicker book */
  const getBookWidth = (count: number) => {
    if (count >= 10) return 52;
    if (count >= 5) return 46;
    return 40;
  };

  /* ── Scroll state (must be before early return) ────────────── */
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, notebooks.length]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  /* Empty shelf */
  if (notebooks.length === 0) {
    return (
      <div className="mb-6 flex flex-col items-center py-8 rounded-xl bg-foreground/[0.02] border border-dashed border-muted-foreground/15">
        <BookOpen className="h-8 w-8 text-muted-foreground/20 mb-3" />
        <p className="text-sm text-muted-foreground/50 mb-3 font-serif italic">
          Your library is empty
        </p>
        <button
          onClick={onCreateNotebook}
          className="text-sm text-primary/70 hover:text-primary font-medium transition-colors"
        >
          + Create your first notebook
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Label */}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/40 font-serif mb-2 px-3">
        Your Library
      </p>

      {/* Backboard */}
      <div className="relative bg-gradient-to-b from-foreground/[0.025] to-transparent rounded-t-lg pt-3 px-2">
        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/80 border border-primary/15 shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll shelf left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/80 border border-primary/15 shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll shelf right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Fade edges when scrollable */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/60 to-transparent z-10 pointer-events-none rounded-tl-lg" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/60 to-transparent z-10 pointer-events-none rounded-tr-lg" />
        )}

        {/* Books row */}
        <div
          ref={scrollRef}
          role="region"
          aria-label="Notebook shelf"
          className="flex items-end gap-[3px] pb-[14px] overflow-x-auto scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {notebooks.map((nb, i) => {
            const cover = leatherCovers[i % leatherCovers.length];
            const height = bookHeights[i % bookHeights.length];
            const count = noteCounts[nb.id] || 0;
            const isActive = activeNotebookId === nb.id;
            const width = getBookWidth(count);

            return (
              <button
                key={nb.id}
                onClick={() => onSelectNotebook(isActive ? null : nb.id)}
                className={[
                  "relative flex-shrink-0 overflow-hidden snap-start",
                  "rounded-l-[5px] rounded-r-[2px]",
                  cover.base,
                  "transition-all duration-200 ease-out",
                  isActive
                    ? "border-[3px] border-primary ring-[3px] ring-primary/30 shadow-[0_0_12px_rgba(var(--color-primary),0.25)] shadow-lg"
                    : "border border-transparent hover:border-primary-foreground/15 shadow-md",
                  "cursor-pointer group",
                ].join(" ")}
                style={{ height: `${height}px`, width: `${width}px` }}
                aria-label={`${nb.name}, ${count} note${count !== 1 ? "s" : ""}${isActive ? ", selected" : ""}`}
                aria-pressed={isActive}
                title={`${nb.name} (${count} note${count !== 1 ? "s" : ""})`}
              >
                {/* ── Layer 1: Dark overlay → deepens theme color into leather ── */}
                <div
                  className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-70"
                  style={{ backgroundColor: `rgba(0,0,0,${cover.overlay})` }}
                />

                {/* ── Layer 2: Spine highlight (3D roundness) ─────────────── */}
                <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-[5px] bg-gradient-to-r from-white/[0.14] to-transparent" />

                {/* ── Layer 3: Inner shadows for leather depth ─────────────── */}
                <div className="absolute inset-0 rounded-l-[5px] rounded-r-[2px] shadow-[inset_-4px_0_8px_rgba(0,0,0,0.18),inset_0_3px_6px_rgba(0,0,0,0.12),inset_0_-3px_6px_rgba(0,0,0,0.12)]" />

                {/* ── Layer 4: Gilt embossing (theme-tinted) ──────────────── */}
                {/* Top gilt line */}
                <div className="absolute top-2.5 left-2 right-2 h-px bg-primary-foreground/[0.16]" />

                {/* Bottom gilt line */}
                <div className="absolute bottom-6 left-2 right-2 h-px bg-primary-foreground/[0.16]" />

                {/* Center gilt ornament — small diamond */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[20%] w-[5px] h-[5px] rotate-45 border border-primary-foreground/[0.16]" />

                {/* ── Layer 5: Page edges (right side) ────────────────────── */}
                <div className="absolute right-0 top-1.5 bottom-1.5 w-[4px] rounded-r-[2px] bg-gradient-to-l from-background/50 via-background/20 to-transparent" />
                <div className="absolute right-[4px] top-2 bottom-2 w-px bg-background/[0.10]" />

                {/* ── Layer 6: Content ─────────────────────────────────────── */}
                {/* Title — vertical serif text, centered on the spine */}
                <div className="absolute inset-x-0 top-[24%] bottom-[18%] z-10 overflow-hidden flex items-center justify-center">
                  <span
                    className="text-primary-foreground/[0.85] text-[11px] font-serif font-semibold whitespace-nowrap group-hover:text-primary-foreground transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                    style={{ writingMode: "vertical-rl" }}
                  >
                    {nb.name}
                  </span>
                </div>

                {/* Note count */}
                <span className="absolute bottom-1.5 inset-x-0 z-10 text-center text-[9px] text-primary-foreground/[0.35] tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}

          {/* Add-notebook placeholder */}
          <button
            onClick={onCreateNotebook}
            className="flex-shrink-0 w-9 h-[96px] rounded-l-[5px] rounded-r-[2px] border border-dashed border-muted-foreground/15 hover:border-muted-foreground/30 bg-foreground/[0.02] hover:bg-foreground/[0.04] flex items-center justify-center transition-all duration-200 snap-start"
            aria-label="Create new notebook"
            title="Create new notebook"
          >
            <Plus className="h-4 w-4 text-muted-foreground/25 hover:text-muted-foreground/45 transition-colors" />
          </button>
        </div>

        {/* ── Shelf board (theme-tinted) ────────────────────────────── */}
        <div className="h-[14px] bg-gradient-to-b from-primary/[0.14] via-primary/[0.08] to-primary/[0.03] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.06)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/[0.15]" />
      </div>

      {/* Shelf shadow */}
      <div className="h-2.5 mx-1 bg-gradient-to-b from-foreground/[0.05] to-transparent rounded-b-sm" />
    </div>
  );
}
