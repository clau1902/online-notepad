"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { TagInput } from "@/components/tag-input";
import { useAutosave, type SaveStatus } from "@/hooks/use-autosave";
import { formatDistanceToNow } from "@/lib/date-utils";
import type { Note } from "@/components/note-card";
import type { Notebook } from "@/lib/types";
import { ArrowLeft, Trash2, Pin, BookOpen, Check } from "lucide-react";

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
  isGuest: boolean;
  notebooks: Notebook[];
  defaultNotebookId?: string | null;
  onNoteCreated: (note: Note) => void;
  onNotesChanged: () => void;
  onDelete?: () => void;
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <span
      className={`text-sm font-serif italic ${
        status === "saving"
          ? "text-muted-foreground"
          : status === "saved"
            ? "text-primary"
            : "text-destructive"
      }`}
    >
      {status === "saving" && "Saving..."}
      {status === "saved" && "Saved"}
      {status === "error" && "Error saving"}
    </span>
  );
}

function useRelativeTime(dateStr: string | undefined) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!dateStr) return;
    const interval = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(interval);
  }, [dateStr]);
  return dateStr ? formatDistanceToNow(dateStr) : null;
}

export function NoteEditor({
  open,
  onClose,
  note,
  isGuest,
  notebooks,
  defaultNotebookId,
  onNoteCreated,
  onNotesChanged,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCurrentNoteId(note.id);
        setIsPinned(note.isPinned);
        setNotebookId(note.notebookId);
        setTags(note.tags);
      } else {
        setTitle("");
        setContent("");
        setCurrentNoteId(null);
        setIsPinned(false);
        setNotebookId(defaultNotebookId ?? null);
        setTags([]);
      }
    }
  }, [note, open]);

  const { status, saveNow } = useAutosave({
    noteId: currentNoteId,
    title,
    content,
    isPinned,
    notebookId,
    tags,
    isGuest,
    onNoteCreated: (created) => {
      setCurrentNoteId(created.id);
      onNoteCreated(created);
    },
    onNotesChanged,
  });

  const relativeTime = useRelativeTime(note?.updatedAt);
  const currentNotebook = notebooks.find((nb) => nb.id === notebookId);

  const handlePinToggle = () => {
    setIsPinned(!isPinned);
    // saveNow will fire on next render via the useEffect in useAutosave
    // We use a microtask to ensure state has updated
    setTimeout(() => saveNow(), 0);
  };

  const handleNotebookChange = (id: string | null) => {
    setNotebookId(id);
    setTimeout(() => saveNow(), 0);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="!fixed !inset-0 sm:!inset-10 !translate-x-0 !translate-y-0 !top-0 sm:!top-10 !left-0 sm:!left-10 !max-w-none !w-auto !rounded-none sm:!rounded-xl flex flex-col border-border bg-background p-0 overflow-hidden data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4 duration-300"
        showCloseButton={false}
      >
        {/* Colored top accent strip */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-primary via-secondary to-accent" />

        {/* Hidden accessible title */}
        <DialogTitle className="sr-only">
          {note ? "Edit Note" : "New Note"}
        </DialogTitle>

        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-primary/10 bg-primary/[0.03] px-4 sm:px-6 py-3 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <div className="flex-1 flex items-center border-b-2 border-transparent focus-within:border-primary/30 transition-colors">
            <Input
              placeholder="Untitled note..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border-0 bg-transparent text-xl font-serif font-semibold text-foreground placeholder:text-muted-foreground/40 placeholder:italic focus-visible:ring-0 shadow-none tracking-tight"
            />
          </div>

          <SaveStatusIndicator status={status} />

          {relativeTime && (
            <span className="text-xs text-muted-foreground/50 hidden sm:inline whitespace-nowrap">
              {relativeTime}
            </span>
          )}

          {/* Notebook selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Notebook: ${currentNotebook?.name || "None"}`}
                className="text-muted-foreground hover:text-foreground hover:bg-primary/10 gap-1"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline text-xs truncate max-w-[100px]">
                  {currentNotebook?.name || "No notebook"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleNotebookChange(null)}>
                <span className="flex-1">No notebook</span>
                {notebookId === null && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
              {notebooks.length > 0 && <DropdownMenuSeparator />}
              {notebooks.map((nb) => (
                <DropdownMenuItem
                  key={nb.id}
                  onClick={() => handleNotebookChange(nb.id)}
                >
                  <span className="flex-1">{nb.name}</span>
                  {notebookId === nb.id && (
                    <Check className="h-4 w-4 ml-2" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pin toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePinToggle}
            aria-label={isPinned ? "Unpin note" : "Pin note"}
            aria-pressed={isPinned}
            className={`${
              isPinned
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            } hover:text-primary hover:bg-primary/10`}
          >
            <Pin className="h-4 w-4" />
          </Button>

          {note && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              aria-label="Delete note"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Tag input strip */}
        <TagInput tags={tags} onChange={setTags} />

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gradient-to-b from-primary/[0.02] to-transparent">
          <RichTextEditor
            content={content}
            onChange={setContent}
            editorClassName="min-h-[60vh]"
            className="border-0 focus-within:ring-0"
          />
        </div>

        {/* Bottom accent strip */}
        <div className="h-0.5 shrink-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </DialogContent>
    </Dialog>
  );
}
