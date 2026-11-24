"use client";

import { useEffect, useState } from "react";
import { X, ListMusic, Plus } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Playlist } from "@/types";
import { ensureSongInDb } from "@/lib/ensureSongInDb";

export default function AddToPlaylistModal() {
  const { addToPlaylistSong, closeAddToPlaylist, openPlaylist } = useModalStore();
  const { user } = useAuth();
  const supabase = createClient();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!addToPlaylistSong || !user) return;
    setStatus(null);

    const fetchPlaylists = async () => {
      const { data } = await supabase
        .from("playlists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPlaylists((data as Playlist[]) || []);
    };

    fetchPlaylists();
  }, [addToPlaylistSong, user, supabase]);

  if (!addToPlaylistSong) return null;

  const handleAdd = async (playlistId: string, playlistName: string) => {
    if (!user) return;
    const realSongId = await ensureSongInDb(addToPlaylistSong, user.id);
    if (!realSongId) {
      setStatus("There was a problem adding the song.");
      return;
    }

    const { error } = await supabase.from("playlist_songs").insert({
      playlist_id: playlistId,
      song_id: realSongId,
    });

    if (error) {
      if (error.code === "23505") {
       setStatus(`The song is already added to "${playlistName}".`);
      } else {
        setStatus(error.message);
      }
      return;
    }

    setStatus(`"${playlistName}"-Added successfully!`);
    setTimeout(() => {
      closeAddToPlaylist();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl">
        <button
          onClick={closeAddToPlaylist}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-bold text-white mb-3">Add to Playlist</h3>

        {playlists.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-xs text-neutral-400">You don't have any playlist yet.</p>
            <button
              onClick={() => {
                closeAddToPlaylist();
                openPlaylist();
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition"
            >
              <Plus size={14} />Create a new playlist
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {playlists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => handleAdd(pl.id, pl.name)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-800 transition text-left"
              >
                <div className="h-9 w-9 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                  <ListMusic size={16} className="text-violet-400" />
                </div>
                <span className="text-sm font-medium text-white truncate">{pl.name}</span>
              </button>
            ))}
          </div>
        )}

        {status && (
          <p className="mt-3 text-xs text-center text-cyan-400 bg-cyan-500/10 p-2 rounded">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}