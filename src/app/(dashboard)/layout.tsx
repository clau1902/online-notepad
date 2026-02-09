import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { Header } from "@/components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
