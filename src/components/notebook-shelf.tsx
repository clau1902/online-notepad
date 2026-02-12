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
 * its base color, then a dark overlay deepens it into a rich
 * "leather" shade that harmonises with the chosen theme.
 */
const leatherCovers = [
  { base: "bg-primary",      ring: "ring-primary/40",      darkness: "bg-black/[0.32]", darknessHover: "bg-black/[0.24]" },
  { base: "bg-secondary",    ring: "ring-secondary/40",    darkness: "bg-black/[0.28]", darknessHover: "bg-black/[0.20]" },
  { base: "bg-accent",       ring: "ring-accent/40",       darkness: "bg-black/[0.30]", darknessHover: "bg-black/[0.22]" },
  { base: "bg-primary/85",   ring: "ring-primary/30",      darkness: "bg-black/[0.38]", darknessHover: "bg-black/[0.30]" },
  { base: "bg-secondary/85", ring: "ring-secondary/30",    darkness: "bg-black/[0.34]", darknessHover: "bg-black/[0.26]" },
  { base: "bg-accent/85",    ring: "ring-accent/30",       darkness: "bg-black/[0.36]", darknessHover: "bg-black/[0.28]" },
];

/* Varying heights — like real books on a shelf */
const bookHeights = [146, 156, 138, 152, 142, 158, 134, 150];

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
    if (count >= 10) return 72;
    if (count >= 5) return 64;
    return 56;
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

  /* ── Scroll state ─────────────────────────────────────────── */
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

  return (
    <div className="mb-6">
      {/* Label */}
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/40 font-serif mb-2 px-3">
        Your Library
      </p>

      {/* Backboard */}
      <div className="relative bg-gradient-to-b from-foreground/[0.025] to-transparent rounded-t-lg pt-5 px-3">
        {/* Scroll arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-background/80 border border-primary/15 shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-background/80 border border-primary/15 shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Scroll right"
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
          className="flex items-end gap-[5px] pb-[14px] overflow-x-auto scrollbar-none"
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
                  "relative flex-shrink-0 overflow-hidden",
                  "rounded-l-[5px] rounded-r-[2px]",
                  cover.base,
                  "shadow-md",
                  "transition-all duration-200 ease-out",
                  "border-2",
                  isActive
                    ? "border-primary shadow-lg"
                    : "border-transparent hover:border-primary-foreground/20",
                  "cursor-pointer group",
                ].join(" ")}
                style={{ height: `${height}px`, width: `${width}px` }}
                title={`${nb.name} (${count} note${count !== 1 ? "s" : ""})`}
              >
                {/* ── Layer 1: Dark overlay → deepens theme color into leather ── */}
                <div
                  className={`absolute inset-0 ${cover.darkness} group-hover:${cover.darknessHover} transition-colors duration-200`}
                />

                {/* ── Layer 2: Spine highlight (3D roundness) ─────────────── */}
                <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-[5px] bg-gradient-to-r from-white/[0.14] to-transparent" />

                {/* ── Layer 3: Inner shadows for leather depth ─────────────── */}
                <div className="absolute inset-0 rounded-l-[5px] rounded-r-[2px] shadow-[inset_-4px_0_8px_rgba(0,0,0,0.18),inset_0_3px_6px_rgba(0,0,0,0.12),inset_0_-3px_6px_rgba(0,0,0,0.12)]" />

                {/* ── Layer 4: Gilt embossing (theme-tinted) ──────────────── */}
                {/* Top gilt double-rule */}
                <div className="absolute top-3.5 left-3 right-3 h-px bg-primary-foreground/[0.18]" />
                <div className="absolute top-[18px] left-3 right-3 h-px bg-primary-foreground/[0.10]" />

                {/* Bottom gilt double-rule */}
                <div className="absolute bottom-8 left-3 right-3 h-px bg-primary-foreground/[0.18]" />
                <div className="absolute bottom-[30px] left-3 right-3 h-px bg-primary-foreground/[0.10]" />

                {/* Center gilt ornament — small diamond */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[22%] w-[6px] h-[6px] rotate-45 border border-primary-foreground/[0.18]" />

                {/* Tiny gilt dots flanking the ornament */}
                <div className="absolute left-1/2 -translate-x-[14px] top-[22%] mt-[2px] w-[2px] h-[2px] rounded-full bg-primary-foreground/[0.15]" />
                <div className="absolute left-1/2 translate-x-[12px] top-[22%] mt-[2px] w-[2px] h-[2px] rounded-full bg-primary-foreground/[0.15]" />

                {/* ── Layer 5: Page edges (right side) ────────────────────── */}
                <div className="absolute right-0 top-2 bottom-2 w-[5px] rounded-r-[2px] bg-gradient-to-l from-background/50 via-background/20 to-transparent" />
                <div className="absolute right-[5px] top-3 bottom-3 w-px bg-background/[0.12]" />
                <div className="absolute right-[7px] top-4 bottom-4 w-px bg-background/[0.06]" />

                {/* ── Layer 6: Content ─────────────────────────────────────── */}
                {/* Title — vertical serif text, centered on the spine */}
                <div className="absolute inset-x-0 top-[28%] bottom-[22%] z-10 overflow-hidden flex items-center justify-center">
                  <span
                    className="text-primary-foreground/[0.85] text-[13px] font-serif font-semibold whitespace-nowrap group-hover:text-primary-foreground transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
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
            className="flex-shrink-0 w-12 h-[120px] rounded-l-[5px] rounded-r-[2px] border-2 border-dashed border-muted-foreground/15 hover:border-muted-foreground/30 bg-foreground/[0.02] hover:bg-foreground/[0.04] flex items-center justify-center transition-all duration-200"
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
