"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ListMusic, Plus, Heart, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useModalStore } from "@/store/useModalStore";
import { Playlist } from "@/types";

interface PlaylistWithCount extends Playlist {
  playlist_songs?: { count: number }[];
}

export default function LibraryPage() {
  const { user, isLoading } = useAuth();
  const { openAuth, openPlaylist, playlistRefreshKey } = useModalStore();
  const supabase = createClient();

  const [playlists, setPlaylists] = useState<PlaylistWithCount[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setPlaylists([]);
      setFetching(false);
      return;
    }

    const fetchPlaylists = async () => {
      setFetching(true);
      const { data } = await supabase
        .from("playlists")
        .select("*, playlist_songs(count)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPlaylists((data as PlaylistWithCount[]) || []);
      setFetching(false);
    };

    fetchPlaylists();
  }, [user?.id, playlistRefreshKey, supabase]);

  if (!isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <ListMusic size={48} className="text-violet-500" />
        <h2 className="text-xl font-bold text-white">
          Log in to view your Playlists
        </h2>
        <button
          onClick={openAuth}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black hover:scale-105 transition"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Tap any playlist to view and play its songs
          </p>
        </div>
        <button
          onClick={openPlaylist}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white hover:scale-105 transition"
        >
          <Plus size={15} /> New Playlist
        </button>
      </div>

      {/* Liked Songs Shortcut */}
      <Link
        href="/liked"
        className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center shrink-0">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Liked Songs</p>
            <p className="text-xs text-neutral-400">Your favorite tracks</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-neutral-400" />
      </Link>

      {/* Created Playlists */}
      {fetching ? (
        <p className="text-sm text-neutral-400">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-neutral-800 space-y-3">
          <ListMusic size={36} className="text-neutral-500 mx-auto" />
          <p className="text-sm text-neutral-400">
            You haven&apos;t created any playlists yet.
          </p>
          <button
            onClick={openPlaylist}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-xs font-bold hover:scale-105 transition"
          >
            <Plus size={14} /> Create Playlist
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {playlists.map((pl) => {
            const count = pl.playlist_songs?.[0]?.count ?? 0;
            return (
              <Link
                key={pl.id}
                href={`/playlist/${pl.id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/40 hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <ListMusic size={22} className="text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {pl.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      Playlist • {count} {count === 1 ? "Song" : "Songs"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-neutral-400 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}