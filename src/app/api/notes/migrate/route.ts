import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { note } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const guestNotes = body.notes;

  if (!Array.isArray(guestNotes) || guestNotes.length === 0) {
    return NextResponse.json({ error: "No notes to migrate" }, { status: 400 });
  }

  // Limit to 100 notes to prevent abuse
  const toMigrate = guestNotes.slice(0, 100);

  const created = await db
    .insert(note)
    .values(
      toMigrate.map((n: { title?: string; content?: string }) => ({
        userId: session.user.id,
        title: n.title || "",
        content: n.content || "",
      }))
    )
    .returning();

  return NextResponse.json(created, { status: 201 });
}
