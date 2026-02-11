import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notebook } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-session";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notebooks = await db
    .select()
    .from(notebook)
    .where(eq(notebook.userId, session.user.id))
    .orderBy(asc(notebook.name));

  return NextResponse.json(notebooks);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const [created] = await db
    .insert(notebook)
    .values({
      userId: session.user.id,
      name: body.name || "Untitled",
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
