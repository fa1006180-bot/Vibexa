"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ListMusic } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const isPlaylistActive =
    pathname === "/library" || pathname.startsWith("/playlist/");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-2">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          pathname === "/" ? "text-violet-400 font-semibold" : "text-neutral-300"
        }`}
      >
        <Home size={20} />
        Home
      </Link>
      <Link
        href="/search"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          pathname === "/search" ? "text-violet-400 font-semibold" : "text-neutral-300"
        }`}
      >
        <Search size={20} />
        Search
      </Link>
      <Link
        href="/liked"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          pathname === "/liked" ? "text-violet-400 font-semibold" : "text-neutral-300"
        }`}
      >
        <Heart size={20} />
        Liked
      </Link>
      <Link
        href="/library"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          isPlaylistActive ? "text-violet-400 font-semibold" : "text-neutral-300"
        }`}
      >
        <ListMusic size={20} />
        Playlists
      </Link>
    </nav>
  );
}