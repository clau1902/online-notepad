import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getSession } from "@/lib/auth-session";
import { eq } from "drizzle-orm";
import { THEME_IDS, type ThemeId } from "@/lib/themes";

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const theme = body.theme as ThemeId;

  if (!THEME_IDS.includes(theme)) {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }

  await db
    .update(user)
    .set({ theme, updatedAt: new Date() })
    .where(eq(user.id, session.user.id));

  return NextResponse.json({ theme });
}
