"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ThemeDecoration } from "@/components/decorations";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ThemeDecoration size="small" className="h-7 w-7" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-primary">Notepad</h1>
        </Link>
        {!isPending && (
          session ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )
        )}
      </div>
    </header>
  );
}
