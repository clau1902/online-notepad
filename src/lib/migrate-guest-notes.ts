import { getGuestNotes, clearGuestNotes } from "./guest-notes";

export async function migrateGuestNotes(): Promise<void> {
  const guestNotes = getGuestNotes();
  if (guestNotes.length === 0) return;

  try {
    const res = await fetch("/api/notes/migrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: guestNotes }),
    });
    if (res.ok) {
      clearGuestNotes();
    }
  } catch {
    // Migration failed silently — notes remain in localStorage
  }
}
