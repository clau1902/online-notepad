"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  noteTitle: string;
}

export function DeleteNoteDialog({
  open,
  onClose,
  onConfirm,
  noteTitle,
}: DeleteNoteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !deleting && onClose()}>
      <DialogContent className="sm:max-w-md border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{noteTitle || "Untitled"}&rdquo;?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleting}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setDeleting(true);
              try {
                await onConfirm();
                onClose();
              } finally {
                setDeleting(false);
              }
            }}
            disabled={deleting}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
