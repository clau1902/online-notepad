export interface GuestNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "guest_notes";

export function getGuestNotes(): GuestNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
}): GuestNote {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: data.title,
    content: data.content,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateGuestNote(
  notes: GuestNote[],
  id: string,
  data: { title?: string; content?: string }
): GuestNote[] {
  return notes.map((n) =>
    n.id === id
      ? {
          ...n,
          ...(data.title !== undefined && { title: data.title }),
          ...(data.content !== undefined && { content: data.content }),
          updatedAt: new Date().toISOString(),
        }
      : n
  );
}

export function deleteGuestNote(notes: GuestNote[], id: string): GuestNote[] {
  return notes.filter((n) => n.id !== id);
}
