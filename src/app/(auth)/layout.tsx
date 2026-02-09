import { FlowerDecoration, SmallFlower } from "@/components/flower-decoration";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center relative overflow-hidden">
      {/* Background flower decorations */}
      <FlowerDecoration className="absolute top-10 left-10 w-32 h-32 opacity-30 -rotate-12" />
      <FlowerDecoration className="absolute bottom-10 right-10 w-40 h-40 opacity-20 rotate-12" />
      <SmallFlower className="absolute top-1/4 right-20 w-12 h-12 opacity-40" />
      <SmallFlower className="absolute bottom-1/3 left-16 w-10 h-10 opacity-30 rotate-45" />
      <SmallFlower className="absolute top-16 right-1/3 w-8 h-8 opacity-25" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0CFDA]/10 via-transparent to-[#C8E0D0]/10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
