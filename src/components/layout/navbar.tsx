"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Compass, Heart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiKeyDialog } from "@/components/settings/api-key-dialog";

const navItems = [
  { href: "/", label: "Create", icon: Sparkles },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <nav className="mx-auto max-w-6xl flex items-center justify-between rounded-2xl glass px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-violet-500 shadow-lg shadow-rose-200/50">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Captionly</span>
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-xl gap-1.5 text-sm",
                  pathname === href && "bg-white/60 shadow-sm"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ApiKeyDialog />
        </div>
      </nav>

      <div className="sm:hidden mx-auto max-w-6xl mt-2">
        <div className="flex items-center justify-center gap-1 rounded-2xl glass px-2 py-1.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full rounded-xl gap-1 text-xs",
                  pathname === href && "bg-white/60 shadow-sm"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
