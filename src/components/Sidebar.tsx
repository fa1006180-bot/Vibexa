"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus, Heart, Disc3, ListMusic } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Playlist } from "@/types";

export default function Sidebar() {
  const pathname = usePathname();
  const { openAuth, openPlaylist, playlistRefreshKey } = useModalStore();
  const { user } = useAuth();
  const supabase = createClient();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (!user?.id) {
      setPlaylists([]);
      return;
    }

    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPlaylists((data as Playlist[]) || []);
    };

    fetchPlaylists();
  }, [user?.id, playlistRefreshKey, supabase]);

  const handleCreatePlaylist = () => {
    if (!user) return openAuth();
    openPlaylist();
  };

  return (
    <aside className="hidden md:flex flex-col gap-2 w-[280px] h-full p-2 bg-black">
      {/* Brand + Navigation */}
      <div className="bg-neutral-900 rounded-lg p-4 space-y-4">
        <Link href="/" className="flex items-center gap-2.5 px-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center">
            <Disc3 className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
            Vibexa
          </span>
        </Link>

        <nav className="space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium transition ${
              pathname === "/" ? "text-white bg-neutral-800/70" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Home size={20} />
            Home
          </Link>
          <Link
            href="/search"
            className={`flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium transition ${
              pathname === "/search" ? "text-white bg-neutral-800/70" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Search size={20} />
            Search
          </Link>
        </nav>
      </div>

      {/* Library Section */}
      <div className="flex-1 bg-neutral-900 rounded-lg p-4 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-neutral-400">
            <Library size={20} />
            <span className="text-sm font-semibold">Your Library</span>
          </div>
          <button
            onClick={handleCreatePlaylist}
            title="Create Playlist"
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <Plus size={18} />
          </button>
        </div>

        <Link
          href="/liked"
          className={`flex items-center gap-3 p-2 rounded-md transition mb-2 ${
            pathname === "/liked" ? "bg-neutral-800" : "hover:bg-neutral-800/60"
          }`}
        >
          <div className="h-11 w-11 rounded bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center shrink-0">
            <Heart size={18} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Liked Songs</p>
            <p className="text-xs text-neutral-400">Your favorite songs</p>
          </div>
        </Link>

        {/* User Playlists */}
        <div className="space-y-1 mt-1">
          {playlists.map((pl) => (
            <Link
              key={pl.id}
              href={`/playlist/${pl.id}`}
              className={`flex items-center gap-3 p-2 rounded-md transition ${
                pathname === `/playlist/${pl.id}` ? "bg-neutral-800" : "hover:bg-neutral-800/60"
              }`}
            >
              <div className="h-10 w-10 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                <ListMusic size={17} className="text-violet-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{pl.name}</p>
                <p className="text-xs text-neutral-400">Playlist</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}