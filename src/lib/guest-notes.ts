export interface GuestNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  notebookId: string | null;
  tags: string[];
}

export interface GuestNotebook {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "guest_notes";
const NOTEBOOKS_KEY = "guest_notebooks";

// ── Notes ───────────────────────────────────────────────────────

export function getGuestNotes(): GuestNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const notes = JSON.parse(raw) as GuestNote[];
    return notes.map((n) => ({
      ...n,
      isPinned: n.isPinned ?? false,
      notebookId: n.notebookId ?? null,
      tags: n.tags ?? [],
    }));
  } catch {
    return [];
  }
}

export function saveGuestNotes(notes: GuestNote[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function clearGuestNotes(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function createGuestNote(data: {
  title: string;
  content: string;
  isPinned?: boolean;
  notebookId?: string | null;
  tags?: string[];
}): GuestNote {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    isPinned: data.isPinned ?? false,
    notebookId: data.notebookId ?? null,
    tags: data.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateGuestNote(
  notes: GuestNote[],
  id: string,
  data: {
    title?: string;
    content?: string;
    isPinned?: boolean;
    notebookId?: string | null;
    tags?: string[];
  }
): GuestNote[] {
  return notes.map((n) =>
    n.id === id
      ? {
          ...n,
          ...(data.title !== undefined && { title: data.title }),
          ...(data.content !== undefined && { content: data.content }),
          ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
          ...(data.notebookId !== undefined && { notebookId: data.notebookId }),
          ...(data.tags !== undefined && { tags: data.tags }),
          updatedAt: new Date().toISOString(),
        }
      : n
  );
}

export function deleteGuestNote(notes: GuestNote[], id: string): GuestNote[] {
  return notes.filter((n) => n.id !== id);
}

// ── Notebooks ───────────────────────────────────────────────────

export function getGuestNotebooks(): GuestNotebook[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTEBOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGuestNotebooks(notebooks: GuestNotebook[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTEBOOKS_KEY, JSON.stringify(notebooks));
}

export function createGuestNotebook(name: string): GuestNotebook {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), name, createdAt: now, updatedAt: now };
}

export function deleteGuestNotebook(
  notebooks: GuestNotebook[],
  id: string
): GuestNotebook[] {
  return notebooks.filter((n) => n.id !== id);
}

export function renameGuestNotebook(
  notebooks: GuestNotebook[],
  id: string,
  name: string
): GuestNotebook[] {
  return notebooks.map((n) =>
    n.id === id
      ? { ...n, name, updatedAt: new Date().toISOString() }
      : n
  );
}
