import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { getSession } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_THEME, THEME_IDS, type ThemeId } from "@/lib/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Notepad - Your Personal Notes",
  description: "A calming, themed online notepad for your thoughts",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userTheme: ThemeId = DEFAULT_THEME;

  const session = await getSession();
  if (session) {
    const [record] = await db
      .select({ theme: user.theme })
      .from(user)
      .where(eq(user.id, session.user.id));
    if (record?.theme && THEME_IDS.includes(record.theme as ThemeId)) {
      userTheme = record.theme as ThemeId;
    }
  }

  return (
    <html
      lang="en"
      data-theme={userTheme}
      className={userTheme === "midnight" ? "dark" : ""}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          initialTheme={userTheme}
          persistToServer={!!session}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
