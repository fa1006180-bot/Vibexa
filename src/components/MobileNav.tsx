"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, PlusSquare } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";

export default function MobileNav() {
  const pathname = usePathname();
  const { openPlaylist, openAuth } = useModalStore();
  const { user } = useAuth();

  return (
    <nav className="md:hidden shrink-0 z-50 flex items-center justify-around bg-neutral-950 border-t border-neutral-800 pt-2.5 pb-4 px-2"> 
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          pathname === "/" ? "text-violet-400" : "text-neutral-400"
        }`}
      >
        <Home size={20} />
        Home
      </Link>
      <Link
        href="/search"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          pathname === "/search" ? "text-violet-400" : "text-neutral-400"
        }`}
      >
        <Search size={20} />
        Search
      </Link>
      <Link
        href="/liked"
        className={`flex flex-col items-center gap-1 text-[11px] ${
          pathname === "/liked" ? "text-violet-400" : "text-neutral-400"
        }`}
      >
        <Heart size={20} />
        Liked
      </Link>
      <button
        onClick={() => (user ? openPlaylist() : openAuth())}
        className="flex flex-col items-center gap-1 text-[11px] text-neutral-400"
      >
        <PlusSquare size={20} />
        Playlist
      </button>
    </nav>
  );
}