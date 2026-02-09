"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteCard, type Note } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { DeleteNoteDialog } from "@/components/delete-note-dialog";
import { ThemeDecoration } from "@/components/decorations";
import { GuestSignupPrompt } from "@/components/guest-signup-prompt";
import {
  getGuestNotes,
  saveGuestNotes,
  createGuestNote,
  updateGuestNote,
  deleteGuestNote,
} from "@/lib/guest-notes";
import { Plus } from "lucide-react";

export default function NotesPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const isGuest = !session;

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // ── Fetch notes (API for auth, localStorage for guest) ──────

  const fetchNotes = useCallback(async () => {
    if (sessionLoading) return;

    if (!isGuest) {
      const res = await fetch("/api/notes");
      if (res.ok) {
        setNotes(await res.json());
      }
    } else {
      setNotes(getGuestNotes());
    }
    setLoading(false);
  }, [isGuest, sessionLoading]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ── CRUD handlers ───────────────────────────────────────────

  const handleCreate = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
  };

  const handleSave = async (data: { title: string; content: string }) => {
    if (isGuest) {
      const current = getGuestNotes();
      if (editingNote) {
        const updated = updateGuestNote(current, editingNote.id, data);
        saveGuestNotes(updated);
      } else {
        const newNote = createGuestNote(data);
        saveGuestNotes([newNote, ...current]);
      }
      setNotes(getGuestNotes());
    } else {
      if (editingNote) {
        await fetch(`/api/notes/${editingNote.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      await fetchNotes();
    }
  };

  const handleDeleteClick = () => {
    if (editingNote) {
      setDeletingNote(editingNote);
      setEditorOpen(false);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;

    if (isGuest) {
      const updated = deleteGuestNote(getGuestNotes(), deletingNote.id);
      saveGuestNotes(updated);
      setNotes(updated);
    } else {
      await fetch(`/api/notes/${deletingNote.id}`, { method: "DELETE" });
      await fetchNotes();
    }
    setDeletingNote(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-foreground">My Notes</h2>
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {loading || sessionLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ThemeDecoration className="w-32 h-32 mb-6 opacity-40" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No notes yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first note to get started
          </p>
          <Button
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} onClick={() => handleEdit(n)} />
          ))}
        </div>
      )}

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        note={editingNote}
        onSave={handleSave}
        onDelete={handleDeleteClick}
      />

      <DeleteNoteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        noteTitle={deletingNote?.title || ""}
      />

      {isGuest && !sessionLoading && notes.length > 0 && (
        <GuestSignupPrompt noteCount={notes.length} />
      )}
    </div>
  );
}
