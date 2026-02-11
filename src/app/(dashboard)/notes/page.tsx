"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NoteCard, type Note } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { DeleteNoteDialog } from "@/components/delete-note-dialog";
import { NotebookDialog } from "@/components/notebook-dialog";
import { ThemeDecoration } from "@/components/decorations";
import { GuestSignupPrompt } from "@/components/guest-signup-prompt";
import type { Notebook } from "@/lib/types";
import {
  getGuestNotes,
  saveGuestNotes,
  deleteGuestNote,
  getGuestNotebooks,
  saveGuestNotebooks,
  createGuestNotebook,
  deleteGuestNotebook,
  renameGuestNotebook,
} from "@/lib/guest-notes";
import {
  Plus,
  Search,
  BookOpen,
  ArrowUpDown,
  X,
  Pencil,
  Trash2,
} from "lucide-react";

type SortBy = "updated" | "created" | "titleAsc" | "titleDesc";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function NotesPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const isGuest = !session;

  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  // Filters & sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("updated");
  const [filterNotebookId, setFilterNotebookId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Notebook dialog
  const [notebookDialogOpen, setNotebookDialogOpen] = useState(false);
  const [notebookDialogMode, setNotebookDialogMode] = useState<
    "create" | "rename"
  >("create");
  const [editingNotebook, setEditingNotebook] = useState<Notebook | null>(null);

  // ── Fetch data ────────────────────────────────────────────────

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

  const fetchNotebooks = useCallback(async () => {
    if (sessionLoading) return;

    if (!isGuest) {
      const res = await fetch("/api/notebooks");
      if (res.ok) {
        setNotebooks(await res.json());
      }
    } else {
      setNotebooks(getGuestNotebooks());
    }
  }, [isGuest, sessionLoading]);

  useEffect(() => {
    fetchNotes();
    fetchNotebooks();
  }, [fetchNotes, fetchNotebooks]);

  // ── Filtered & sorted notes ───────────────────────────────────

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Notebook filter
    if (filterNotebookId === "__uncategorized__") {
      result = result.filter((n) => n.notebookId === null);
    } else if (filterNotebookId) {
      result = result.filter((n) => n.notebookId === filterNotebookId);
    }

    // Tag filter
    if (filterTag) {
      result = result.filter((n) => n.tags.includes(filterTag));
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          stripHtml(n.content).toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort: pinned first, then by criteria
    result.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      switch (sortBy) {
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "titleAsc":
          return (a.title || "Untitled").localeCompare(b.title || "Untitled");
        case "titleDesc":
          return (b.title || "Untitled").localeCompare(a.title || "Untitled");
      }
    });

    return result;
  }, [notes, filterNotebookId, filterTag, searchQuery, sortBy]);

  // ── CRUD handlers ─────────────────────────────────────────────

  const handleCreate = () => {
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setEditorOpen(true);
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

  const refreshData = () => {
    if (isGuest) {
      setNotes(getGuestNotes());
      setNotebooks(getGuestNotebooks());
    } else {
      fetchNotes();
      fetchNotebooks();
    }
  };

  // ── Notebook handlers ─────────────────────────────────────────

  const handleCreateNotebook = () => {
    setEditingNotebook(null);
    setNotebookDialogMode("create");
    setNotebookDialogOpen(true);
  };

  const handleRenameNotebook = (nb: Notebook) => {
    setEditingNotebook(nb);
    setNotebookDialogMode("rename");
    setNotebookDialogOpen(true);
  };

  const handleNotebookSubmit = async (name: string) => {
    if (isGuest) {
      if (notebookDialogMode === "create") {
        const nb = createGuestNotebook(name);
        const current = getGuestNotebooks();
        saveGuestNotebooks([...current, nb]);
      } else if (editingNotebook) {
        const current = getGuestNotebooks();
        saveGuestNotebooks(
          renameGuestNotebook(current, editingNotebook.id, name)
        );
      }
      setNotebooks(getGuestNotebooks());
    } else {
      if (notebookDialogMode === "create") {
        await fetch("/api/notebooks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      } else if (editingNotebook) {
        await fetch(`/api/notebooks/${editingNotebook.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
      }
      await fetchNotebooks();
    }
  };

  const handleDeleteNotebook = async (nb: Notebook) => {
    if (isGuest) {
      const current = getGuestNotebooks();
      saveGuestNotebooks(deleteGuestNotebook(current, nb.id));
      // Clear notebookId from notes that belonged to this notebook
      const currentNotes = getGuestNotes();
      const updated = currentNotes.map((n) =>
        n.notebookId === nb.id ? { ...n, notebookId: null } : n
      );
      saveGuestNotes(updated);
      setNotebooks(getGuestNotebooks());
      setNotes(getGuestNotes());
    } else {
      await fetch(`/api/notebooks/${nb.id}`, { method: "DELETE" });
      await fetchNotebooks();
      await fetchNotes();
    }
    if (filterNotebookId === nb.id) {
      setFilterNotebookId(null);
    }
  };

  // ── Sort labels ───────────────────────────────────────────────

  const sortLabels: Record<SortBy, string> = {
    updated: "Last updated",
    created: "Date created",
    titleAsc: "Title A\u2013Z",
    titleDesc: "Title Z\u2013A",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">My Notes</h2>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-input"
          />
        </div>

        {/* Notebook filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-border gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">
                {filterNotebookId === null
                  ? "All Notes"
                  : filterNotebookId === "__uncategorized__"
                    ? "Uncategorized"
                    : notebooks.find((n) => n.id === filterNotebookId)?.name ||
                      "All Notes"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => setFilterNotebookId(null)}>
              All Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterNotebookId("__uncategorized__")}
            >
              Uncategorized
            </DropdownMenuItem>
            {notebooks.length > 0 && <DropdownMenuSeparator />}
            {notebooks.map((nb) => (
              <div key={nb.id} className="flex items-center group">
                <DropdownMenuItem
                  className="flex-1"
                  onClick={() => setFilterNotebookId(nb.id)}
                >
                  {nb.name}
                </DropdownMenuItem>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameNotebook(nb);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotebook(nb);
                  }}
                  className="p-1 mr-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateNotebook}>
              <Plus className="h-4 w-4 mr-1" /> New Notebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-border gap-1">
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(sortLabels) as SortBy[]).map((key) => (
              <DropdownMenuItem key={key} onClick={() => setSortBy(key)}>
                {sortLabels[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Note */}
        <Button
          onClick={handleCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Active tag filter */}
      {filterTag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            Filtering by tag:
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">
            {filterTag}
            <button
              onClick={() => setFilterTag(null)}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      {/* Notes grid */}
      {loading || sessionLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ThemeDecoration className="w-32 h-32 mb-6 opacity-40" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {notes.length === 0 ? "No notes yet" : "No notes match"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {notes.length === 0
              ? "Create your first note to get started"
              : "Try a different search or filter"}
          </p>
          {notes.length === 0 && (
            <Button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onClick={() => handleEdit(n)}
              onTagClick={(tag) => setFilterTag(tag)}
            />
          ))}
        </div>
      )}

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        note={editingNote}
        isGuest={isGuest}
        notebooks={notebooks}
        onNoteCreated={(created) => setEditingNote(created)}
        onNotesChanged={refreshData}
        onDelete={handleDeleteClick}
      />

      <DeleteNoteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        noteTitle={deletingNote?.title || ""}
      />

      <NotebookDialog
        open={notebookDialogOpen}
        onClose={() => setNotebookDialogOpen(false)}
        onSubmit={handleNotebookSubmit}
        initialName={editingNotebook?.name || ""}
        mode={notebookDialogMode}
      />

      {isGuest && !sessionLoading && notes.length > 0 && (
        <GuestSignupPrompt noteCount={notes.length} />
      )}
    </div>
  );
}
