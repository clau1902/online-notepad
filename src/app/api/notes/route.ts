import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { note } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-session";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notes = await db
    .select()
    .from(note)
    .where(eq(note.userId, session.user.id))
    .orderBy(desc(note.updatedAt));

  return NextResponse.json(notes);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const [newNote] = await db
    .insert(note)
    .values({
      userId: session.user.id,
      title: body.title || "",
      content: body.content || "",
    })
    .returning();

  return NextResponse.json(newNote, { status: 201 });
}
