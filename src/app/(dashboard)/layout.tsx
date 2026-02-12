import { Header } from "@/components/header";
import { OfflineBanner } from "@/components/offline-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <OfflineBanner />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
