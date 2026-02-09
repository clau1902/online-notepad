import { SmallFlower } from "@/components/flower-decoration";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8F0E8] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SmallFlower className="h-7 w-7" />
          <h1 className="text-xl font-semibold text-[#A78BCC]">Notepad</h1>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}
