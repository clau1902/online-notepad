"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "@/lib/date-utils";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <Card
      className="cursor-pointer border-[#E8F0E8] bg-white/80 hover:bg-white hover:shadow-md transition-all hover:border-[#A78BCC]/30 group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-800 truncate group-hover:text-[#A78BCC] transition-colors">
          {note.title || "Untitled"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {note.content || "No content"}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {formatDistanceToNow(note.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}
