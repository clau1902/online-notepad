"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  getGuestNotes,
  saveGuestNotes,
  createGuestNote,
  updateGuestNote,
} from "@/lib/guest-notes";
import type { Note } from "@/components/note-card";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutosaveOptions {
  noteId: string | null;
  title: string;
  content: string;
  isGuest: boolean;
  onNoteCreated: (note: Note) => void;
  onNotesChanged: () => void;
}

const DEBOUNCE_MS = 1500;
const SAVED_DISPLAY_MS = 2000;

export function useAutosave({
  noteId,
  title,
  content,
  isGuest,
  onNoteCreated,
  onNotesChanged,
}: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const lastSavedRef = useRef<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize the last-saved snapshot when opening an existing note
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current) {
      lastSavedRef.current = { title, content };
      initRef.current = true;
    }
  }, []);

  // Reset when the note changes (e.g. opening a different note)
  const prevNoteIdRef = useRef(noteId);
  useEffect(() => {
    if (prevNoteIdRef.current !== noteId) {
      lastSavedRef.current = { title, content };
      prevNoteIdRef.current = noteId;
      setStatus("idle");
    }
  }, [noteId, title, content]);

  const performSave = useCallback(
    async (saveTitle: string, saveContent: string) => {
      if (savingRef.current) return;

      // Skip empty notes
      if (!saveTitle.trim() && !saveContent.trim()) return;

      // Skip if nothing changed
      if (
        saveTitle === lastSavedRef.current.title &&
        saveContent === lastSavedRef.current.content
      ) {
        return;
      }

      savingRef.current = true;
      setStatus("saving");

      try {
        if (isGuest) {
          if (noteId) {
            const notes = getGuestNotes();
            const updated = updateGuestNote(notes, noteId, {
              title: saveTitle,
              content: saveContent,
            });
            saveGuestNotes(updated);
          } else {
            const newNote = createGuestNote({
              title: saveTitle,
              content: saveContent,
            });
            const notes = getGuestNotes();
            saveGuestNotes([newNote, ...notes]);
            onNoteCreated(newNote as Note);
          }
        } else {
          if (noteId) {
            await fetch(`/api/notes/${noteId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: saveTitle, content: saveContent }),
            });
          } else {
            const res = await fetch("/api/notes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title: saveTitle, content: saveContent }),
            });
            if (res.ok) {
              const created: Note = await res.json();
              onNoteCreated(created);
            }
          }
        }

        lastSavedRef.current = { title: saveTitle, content: saveContent };
        onNotesChanged();
        setStatus("saved");

        // Clear any existing saved timer
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => {
          setStatus("idle");
        }, SAVED_DISPLAY_MS);
      } catch {
        setStatus("error");
      } finally {
        savingRef.current = false;
      }
    },
    [noteId, isGuest, onNoteCreated, onNotesChanged]
  );

  // Debounced autosave on title/content changes
  useEffect(() => {
    // Don't trigger on the initial mount
    if (!initRef.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      performSave(title, content);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, content, performSave]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  return { status };
}
