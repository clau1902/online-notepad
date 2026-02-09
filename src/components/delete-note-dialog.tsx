"use client";

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
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md border-[#E8F0E8] bg-[#FAF8F5]">
        <DialogHeader>
          <DialogTitle className="text-[#CC7070]">Delete Note</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{noteTitle || "Untitled"}&rdquo;?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#E8F0E8]"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            className="bg-[#CC7070] hover:bg-[#BB5F5F] text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
