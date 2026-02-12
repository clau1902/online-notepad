"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  getGuestNotes,
  saveGuestNotes,
  createGuestNote,
  updateGuestNote,
} from "@/lib/guest-notes";
import { toast } from "sonner";
import type { Note } from "@/components/note-card";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface SaveSnapshot {
  title: string;
  content: string;
  isPinned: boolean;
  notebookId: string | null;
  tags: string[];
}

interface UseAutosaveOptions {
  noteId: string | null;
  title: string;
  content: string;
  isPinned: boolean;
  notebookId: string | null;
  tags: string[];
  isGuest: boolean;
  onNoteCreated: (note: Note) => void;
  onNotesChanged: () => void;
}

const DEBOUNCE_MS = 1500;
const SAVED_DISPLAY_MS = 2000;

function snapshotsEqual(a: SaveSnapshot, b: SaveSnapshot): boolean {
  return (
    a.title === b.title &&
    a.content === b.content &&
    a.isPinned === b.isPinned &&
    a.notebookId === b.notebookId &&
    a.tags.length === b.tags.length &&
    a.tags.every((t, i) => t === b.tags[i])
  );
}

export function useAutosave({
  noteId,
  title,
  content,
  isPinned,
  notebookId,
  tags,
  isGuest,
  onNoteCreated,
  onNotesChanged,
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const lastSavedRef = useRef<SaveSnapshot>({
    title: "",
    content: "",
    isPinned: false,
    notebookId: null,
    tags: [],
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current) {
      lastSavedRef.current = { title, content, isPinned, notebookId, tags };
      initRef.current = true;
    }
  }, []);

  const prevNoteIdRef = useRef(noteId);
  useEffect(() => {
    if (prevNoteIdRef.current !== noteId) {
      lastSavedRef.current = { title, content, isPinned, notebookId, tags };
      prevNoteIdRef.current = noteId;
      setStatus("idle");
    }
  }, [noteId, title, content, isPinned, notebookId, tags]);

  const performSave = useCallback(
    async (snapshot: SaveSnapshot) => {
      if (savingRef.current) return;

      if (!snapshot.title.trim() && !snapshot.content.trim()) return;

      if (snapshotsEqual(snapshot, lastSavedRef.current)) return;

      savingRef.current = true;
      setStatus("saving");

      try {
        if (isGuest) {
          if (noteId) {
            const notes = getGuestNotes();
            const updated = updateGuestNote(notes, noteId, snapshot);
            saveGuestNotes(updated);
          } else {
            const newNote = createGuestNote(snapshot);
            const notes = getGuestNotes();
            saveGuestNotes([newNote, ...notes]);
            onNoteCreated(newNote as Note);
          }
        } else {
          if (noteId) {
            await fetch(`/api/notes/${noteId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(snapshot),
            });
          } else {
            const res = await fetch("/api/notes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(snapshot),
            });
            if (res.ok) {
              const created: Note = await res.json();
              onNoteCreated(created);
            }
          }
        }

        lastSavedRef.current = { ...snapshot };
        onNotesChanged();
        setStatus("saved");

        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => {
          setStatus("idle");
        }, SAVED_DISPLAY_MS);
      } catch {
        setStatus("error");
        toast.error("Failed to save note");
      } finally {
        savingRef.current = false;
      }
    },
    [noteId, isGuest, onNoteCreated, onNotesChanged]
  );

  const currentSnapshot = useCallback(
    (): SaveSnapshot => ({ title, content, isPinned, notebookId, tags }),
    [title, content, isPinned, notebookId, tags]
  );

  // Debounced autosave
  useEffect(() => {
    if (!initRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      performSave(currentSnapshot());
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, content, isPinned, notebookId, tags, performSave, currentSnapshot]);

  // Immediate save (for pin toggle, notebook change)
  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    performSave(currentSnapshot());
  }, [performSave, currentSnapshot]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  return { status, saveNow };
}
