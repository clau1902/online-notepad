"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { formatDistanceToNow } from "@/lib/date-utils";
import { Pin, PinOff, Trash2, BookOpen } from "lucide-react";
import type { Notebook } from "@/lib/types";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  notebookId: string | null;
  tags: string[];
}

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onTagClick?: (tag: string) => void;
  onTogglePin?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onMoveToNotebook?: (note: Note, notebookId: string | null) => void;
  notebooks?: Notebook[];
  index?: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function NoteCard({
  note,
  onClick,
  onTagClick,
  onTogglePin,
  onDelete,
  onMoveToNotebook,
  notebooks = [],
  index = 0,
}: NoteCardProps) {
  const preview = stripHtml(note.content);

  const card = (
    <Card
      className="cursor-pointer border-border bg-card/80 hover:bg-card hover:shadow-md transition-all hover:border-primary/30 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-backwards"
      style={{ animationDelay: `${index * 75}ms` }}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <CardTitle className="text-base font-medium text-foreground truncate group-hover:text-primary transition-colors flex-1">
            {note.title || "Untitled"}
          </CardTitle>
          {note.isPinned && (
            <Pin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {preview || "No content"}
        </p>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {note.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                aria-label={`Filter by tag: ${tag}`}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary hover:bg-primary/20 transition-colors"
              >
                {tag}
              </button>
            ))}
            {note.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground/60">
          {formatDistanceToNow(note.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider delayDuration={400}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              {card}
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs line-clamp-4">
                {preview?.slice(0, 200) || "Empty note"}
              </p>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {onTogglePin && (
            <ContextMenuItem onClick={() => onTogglePin(note)}>
              {note.isPinned ? (
                <>
                  <PinOff className="h-4 w-4 mr-2" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4 mr-2" />
                  Pin to top
                </>
              )}
            </ContextMenuItem>
          )}
          {onMoveToNotebook && notebooks.length > 0 && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                disabled
                className="text-xs text-muted-foreground font-normal"
              >
                <BookOpen className="h-3.5 w-3.5 mr-2" />
                Move to notebook
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onMoveToNotebook(note, null)}>
                <span className="ml-6">No notebook</span>
                {note.notebookId === null && (
                  <span className="ml-auto text-primary text-xs">✓</span>
                )}
              </ContextMenuItem>
              {notebooks.map((nb) => (
                <ContextMenuItem
                  key={nb.id}
                  onClick={() => onMoveToNotebook(note, nb.id)}
                >
                  <span className="ml-6 truncate">{nb.name}</span>
                  {note.notebookId === nb.id && (
                    <span className="ml-auto text-primary text-xs">✓</span>
                  )}
                </ContextMenuItem>
              ))}
            </>
          )}
          {onDelete && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => onDelete(note)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
}
