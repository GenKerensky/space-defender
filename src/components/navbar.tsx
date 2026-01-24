import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
          aria-label="Neon Cabinet home"
        >
          Neon Cabinet
        </Link>
        <Button
          variant="ghost"
          size="sm"
          asChild
          aria-label="Login (coming soon)"
        >
          <Link href="#">Login</Link>
        </Button>
      </nav>
    </header>
  );
}
