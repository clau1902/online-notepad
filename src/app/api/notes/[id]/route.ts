import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { note } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-session";
import { and, eq } from "drizzle-orm";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [found] = await db
    .select()
    .from(note)
    .where(and(eq(note.id, id), eq(note.userId, session.user.id)));

  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(found);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(note)
    .set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.content !== undefined && { content: body.content }),
      updatedAt: new Date(),
    })
    .where(and(eq(note.id, id), eq(note.userId, session.user.id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [deleted] = await db
    .delete(note)
    .where(and(eq(note.id, id), eq(note.userId, session.user.id)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
