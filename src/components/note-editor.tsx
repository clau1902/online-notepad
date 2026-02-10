"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { useAutosave, type SaveStatus } from "@/hooks/use-autosave";
import type { Note } from "@/components/note-card";
import { ArrowLeft, Trash2 } from "lucide-react";

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
  isGuest: boolean;
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

export function NoteEditor({
  open,
  onClose,
  note,
  isGuest,
  onNoteCreated,
  onNotesChanged,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setCurrentNoteId(note.id);
      } else {
        setTitle("");
        setContent("");
        setCurrentNoteId(null);
      }
    }
  }, [note, open]);

  const { status } = useAutosave({
    noteId: currentNoteId,
    title,
    content,
    isGuest,
    onNoteCreated: (created) => {
      setCurrentNoteId(created.id);
      onNoteCreated(created);
    },
    onNotesChanged,
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="!fixed !inset-0 sm:!inset-10 !translate-x-0 !translate-y-0 !top-0 sm:!top-10 !left-0 sm:!left-10 !max-w-none !w-auto !rounded-none sm:!rounded-xl flex flex-col border-border bg-background p-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Colored top accent strip */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-primary via-secondary to-accent" />

        {/* Hidden accessible title */}
        <DialogTitle className="sr-only">
          {note ? "Edit Note" : "New Note"}
        </DialogTitle>

        {/* Header bar */}
        <div className="flex items-center gap-3 border-b border-primary/10 bg-primary/[0.03] px-6 py-3 shrink-0">
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

          {note && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-b from-primary/[0.02] to-transparent">
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
