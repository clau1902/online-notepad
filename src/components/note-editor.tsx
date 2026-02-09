"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Note } from "@/components/note-card";

interface NoteEditorProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
  onSave: (data: { title: string; content: string }) => Promise<void>;
  onDelete?: () => void;
}

export function NoteEditor({
  open,
  onClose,
  note,
  onSave,
  onDelete,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note, open]);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ title, content });
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg border-[#E8F0E8] bg-[#FAF8F5]">
        <DialogHeader>
          <DialogTitle className="text-[#A78BCC]">
            {note ? "Edit Note" : "New Note"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[#E8F0E8] focus-visible:ring-[#A78BCC]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="resize-none border-[#E8F0E8] focus-visible:ring-[#A78BCC]"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-between">
          <div>
            {note && onDelete && (
              <Button
                variant="ghost"
                onClick={onDelete}
                className="text-[#CC7070] hover:text-[#CC7070] hover:bg-[#CC7070]/10"
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#E8F0E8]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#A78BCC] hover:bg-[#9577BD] text-white"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
