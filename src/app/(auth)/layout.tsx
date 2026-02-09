import { ThemeDecoration } from "@/components/decorations";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <ThemeDecoration className="absolute top-10 left-10 w-32 h-32 opacity-30 -rotate-12" />
      <ThemeDecoration className="absolute bottom-10 right-10 w-40 h-40 opacity-20 rotate-12" />
      <ThemeDecoration size="small" className="absolute top-1/4 right-20 w-12 h-12 opacity-40" />
      <ThemeDecoration size="small" className="absolute bottom-1/3 left-16 w-10 h-10 opacity-30 rotate-45" />
      <ThemeDecoration size="small" className="absolute top-16 right-1/3 w-8 h-8 opacity-25" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
