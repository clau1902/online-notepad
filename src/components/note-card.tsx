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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const preview = stripHtml(note.content);

  return (
    <Card
      className="cursor-pointer border-border bg-card/80 hover:bg-card hover:shadow-md transition-all hover:border-primary/30 group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {note.title || "Untitled"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {preview || "No content"}
        </p>
        <p className="text-xs text-muted-foreground/60">
          {formatDistanceToNow(note.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}
