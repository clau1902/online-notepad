"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NoteCard, type Note } from "@/components/note-card";
import { NoteEditor } from "@/components/note-editor";
import { DeleteNoteDialog } from "@/components/delete-note-dialog";
import { NotebookDialog } from "@/components/notebook-dialog";
import { NotebookShelf } from "@/components/notebook-shelf";
import { ThemeDecoration } from "@/components/decorations";
import type { Notebook } from "@/lib/types";
import { toast } from "sonner";
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
  LogIn,
  UserPlus,
  AlertTriangle,
  RefreshCw,
  SearchX,
} from "lucide-react";

type SortBy = "updated" | "created" | "titleAsc" | "titleDesc";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
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
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

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

  // Notebook delete confirmation
  const [deleteNotebookDialogOpen, setDeleteNotebookDialogOpen] = useState(false);
  const [deletingNotebook, setDeletingNotebook] = useState<Notebook | null>(null);
  const [deletingNotebookLoading, setDeletingNotebookLoading] = useState(false);

  // Fetch error state
  const [fetchError, setFetchError] = useState(false);

  // ── Search ref & keyboard shortcuts ──────────────────────────
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs/editors
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Cmd/Ctrl+K → focus search (always works)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Escape → clear search if focused
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setSearchQuery("");
        searchRef.current?.blur();
        return;
      }

      if (isInput || editorOpen || deleteDialogOpen || notebookDialogOpen || authDialogOpen) return;

      // N → new note
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleCreate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorOpen, deleteDialogOpen, notebookDialogOpen, authDialogOpen, isGuest]);

  // ── Fetch data ────────────────────────────────────────────────

  const fetchNotes = useCallback(async () => {
    if (sessionLoading) return;

    try {
      if (!isGuest) {
        const res = await fetch("/api/notes");
        if (res.ok) {
          setNotes(await res.json());
        } else {
          setFetchError(true);
        }
      } else {
        setNotes(getGuestNotes());
      }
    } catch {
      setFetchError(true);
    }
    setLoading(false);
  }, [isGuest, sessionLoading]);

  const fetchNotebooks = useCallback(async () => {
    if (sessionLoading) return;

    try {
      if (!isGuest) {
        const res = await fetch("/api/notebooks");
        if (res.ok) {
          setNotebooks(await res.json());
        }
      } else {
        setNotebooks(getGuestNotebooks());
      }
    } catch {
      // Notebook fetch errors are non-critical
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

  const noteRows = useMemo(() => chunk(filteredNotes, 3), [filteredNotes]);

  // ── CRUD handlers ─────────────────────────────────────────────

  const handleCreate = () => {
    if (isGuest) {
      setAuthDialogOpen(true);
      return;
    }
    setEditingNote(null);
    setEditorOpen(true);
  };

  const handleEdit = (note: Note) => {
    if (isGuest) {
      setAuthDialogOpen(true);
      return;
    }
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
    toast.success("Note deleted");
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
    toast.success(notebookDialogMode === "create" ? "Notebook created" : "Notebook renamed");
  };

  const handleDeleteNotebookClick = (nb: Notebook) => {
    setDeletingNotebook(nb);
    setDeleteNotebookDialogOpen(true);
  };

  const handleDeleteNotebookConfirm = async () => {
    if (!deletingNotebook) return;
    setDeletingNotebookLoading(true);
    try {
      if (isGuest) {
        const current = getGuestNotebooks();
        saveGuestNotebooks(deleteGuestNotebook(current, deletingNotebook.id));
        const currentNotes = getGuestNotes();
        const updated = currentNotes.map((n) =>
          n.notebookId === deletingNotebook.id ? { ...n, notebookId: null } : n
        );
        saveGuestNotes(updated);
        setNotebooks(getGuestNotebooks());
        setNotes(getGuestNotes());
      } else {
        await fetch(`/api/notebooks/${deletingNotebook.id}`, { method: "DELETE" });
        await fetchNotebooks();
        await fetchNotes();
      }
      if (filterNotebookId === deletingNotebook.id) {
        setFilterNotebookId(null);
      }
      toast.success("Notebook deleted");
    } finally {
      setDeletingNotebookLoading(false);
      setDeleteNotebookDialogOpen(false);
      setDeletingNotebook(null);
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
        <div>
          <h2 className="text-2xl font-serif font-semibold text-foreground">My Notes</h2>
          {!loading && !sessionLoading && (
            <p className="text-sm text-muted-foreground/60 mt-0.5">
              {searchQuery || filterTag || filterNotebookId
                ? `${filteredNotes.length} result${filteredNotes.length !== 1 ? "s" : ""}`
                : `${notes.length} note${notes.length !== 1 ? "s" : ""}`}
            </p>
          )}
        </div>
      </div>

      {/* Notebook shelf */}
      {!loading && !sessionLoading && (
        <NotebookShelf
          notebooks={notebooks}
          notes={notes}
          activeNotebookId={filterNotebookId}
          onSelectNotebook={setFilterNotebookId}
          onCreateNotebook={handleCreateNotebook}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-16 border-input"
          />
          {searchQuery ? (
            <button
              onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
              ⌘K
            </kbd>
          )}
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
                  aria-label={`Rename ${nb.name}`}
                  className="p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotebookClick(nb);
                  }}
                  aria-label={`Delete ${nb.name}`}
                  className="p-1.5 mr-1 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
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
              aria-label={`Remove tag filter: ${filterTag}`}
              className="hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      {/* ── Bookcase ────────────────────────────────────────────── */}
      <div className="relative rounded-lg overflow-hidden">
        {/* Side panels */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-r from-primary/[0.1] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-l from-primary/[0.1] to-transparent z-10" />

        {/* Top cornice */}
        <div className="h-3.5 bg-gradient-to-b from-primary/[0.14] via-primary/[0.08] to-primary/[0.03]" />
        <div className="h-px bg-primary/[0.12]" />

        {fetchError ? (
          /* Error state */
          <>
            <div className="flex flex-col items-center justify-center py-20 text-center px-5">
              <AlertTriangle className="h-10 w-10 text-destructive/60 mb-4" />
              <h3 className="text-lg font-serif font-medium text-muted-foreground mb-2">
                Failed to load notes
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Something went wrong. Please try again.
              </p>
              <Button
                onClick={() => {
                  setFetchError(false);
                  setLoading(true);
                  fetchNotes();
                  fetchNotebooks();
                }}
                variant="outline"
                className="border-border gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
            <div className="mx-2">
              <div className="h-[3px] bg-gradient-to-b from-primary/[0.14] to-primary/[0.08]" />
              <div className="h-2 bg-gradient-to-b from-primary/[0.08] to-primary/[0.02]" />
              <div className="h-1.5 bg-gradient-to-b from-foreground/[0.04] to-transparent" />
            </div>
          </>
        ) : loading || sessionLoading ? (
          /* Loading shelves */
          <>
            {[0, 1].map((ri) => (
              <div key={ri}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 py-4">
                  {[0, 1, 2].map((ci) => (
                    <Skeleton key={ci} className="h-40 rounded-xl" />
                  ))}
                </div>
                <div className="mx-2">
                  <div className="h-[3px] bg-gradient-to-b from-primary/[0.14] to-primary/[0.08]" />
                  <div className="h-2 bg-gradient-to-b from-primary/[0.08] to-primary/[0.02]" />
                  <div className="h-1.5 bg-gradient-to-b from-foreground/[0.04] to-transparent" />
                </div>
              </div>
            ))}
          </>
        ) : filteredNotes.length === 0 ? (
          /* Empty shelf */
          <>
            {notes.length === 0 ? (
              /* First-time: no notes at all */
              <div className="flex flex-col items-center justify-center py-20 text-center px-5">
                <ThemeDecoration className="w-32 h-32 mb-6 opacity-40" />
                <h3 className="text-lg font-serif font-medium text-muted-foreground mb-2">
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
              /* No results from search/filter */
              <div className="flex flex-col items-center justify-center py-20 text-center px-5">
                <SearchX className="h-12 w-12 text-muted-foreground/25 mb-4" />
                <h3 className="text-lg font-serif font-medium text-muted-foreground mb-2">
                  No notes found
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "Try a different filter"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterTag(null);
                    setFilterNotebookId(null);
                  }}
                  className="border-border gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            )}
            <div className="mx-2">
              <div className="h-[3px] bg-gradient-to-b from-primary/[0.14] to-primary/[0.08]" />
              <div className="h-2 bg-gradient-to-b from-primary/[0.08] to-primary/[0.02]" />
              <div className="h-1.5 bg-gradient-to-b from-foreground/[0.04] to-transparent" />
            </div>
          </>
        ) : (
          /* Note shelves */
          <>
            {noteRows.map((row, ri) => (
              <div key={ri}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5 py-4">
                  {row.map((n, ci) => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      index={ri * 3 + ci}
                      onClick={() => handleEdit(n)}
                      onTagClick={(tag) => setFilterTag(tag)}
                    />
                  ))}
                </div>
                {/* Shelf divider */}
                <div className="mx-2">
                  <div className="h-[3px] bg-gradient-to-b from-primary/[0.14] to-primary/[0.08]" />
                  <div className="h-2 bg-gradient-to-b from-primary/[0.08] to-primary/[0.02]" />
                  <div className="h-1.5 bg-gradient-to-b from-foreground/[0.04] to-transparent" />
                </div>
              </div>
            ))}
          </>
        )}

        {/* Bottom base */}
        <div className="h-px bg-primary/[0.1]" />
        <div className="h-4 bg-gradient-to-t from-primary/[0.1] via-primary/[0.05] to-transparent" />
      </div>

      <NoteEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        note={editingNote}
        isGuest={isGuest}
        notebooks={notebooks}
        defaultNotebookId={
          filterNotebookId && filterNotebookId !== "__uncategorized__"
            ? filterNotebookId
            : null
        }
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

      {/* Notebook delete confirmation */}
      <Dialog
        open={deleteNotebookDialogOpen}
        onOpenChange={(v) => !v && !deletingNotebookLoading && (setDeleteNotebookDialogOpen(false), setDeletingNotebook(null))}
      >
        <DialogContent className="sm:max-w-md border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Notebook</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deletingNotebook?.name || ""}&rdquo;?
              {(() => {
                const count = deletingNotebook ? notes.filter((n) => n.notebookId === deletingNotebook.id).length : 0;
                return count > 0
                  ? ` ${count} note${count !== 1 ? "s" : ""} in this notebook will become uncategorized.`
                  : "";
              })()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => { setDeleteNotebookDialogOpen(false); setDeletingNotebook(null); }}
              disabled={deletingNotebookLoading}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNotebookConfirm}
              disabled={deletingNotebookLoading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deletingNotebookLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth required dialog for guests */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-sm border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-center font-serif text-xl text-foreground">
              Sign in to save notes
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            Create an account or sign in to start writing and organizing your
            notes.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/register">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
