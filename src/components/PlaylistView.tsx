"use client";

import { useState } from "react";
import { ListMusic, Play, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Playlist, Song } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useModalStore } from "@/store/useModalStore";
import SongRow from "./SongRow";

interface PlaylistViewProps {
  playlist: Playlist;
  initialSongs: Song[];
}

export default function PlaylistView({ playlist, initialSongs }: PlaylistViewProps) {
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const { playSong } = usePlayerStore();
  const { triggerPlaylistRefresh } = useModalStore();
  const supabase = createClient();
  const router = useRouter();

  const handleRemoveSong = async (songId: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== songId));
    await supabase
      .from("playlist_songs")
      .delete()
      .eq("playlist_id", playlist.id)
      .eq("song_id", songId);
    router.refresh();
  };

  const handleDeletePlaylist = async () => {
    if (!confirm(`"${playlist.name}" প্লেলিস্টটি কি ডিলিট করতে চান?`)) return;
    await supabase.from("playlists").delete().eq("id", playlist.id);
    triggerPlaylistRefresh();
    router.push("/");
  };

  return (
    <div className="pt-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 rounded-xl bg-gradient-to-b from-cyan-900/50 to-neutral-900 p-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="h-32 w-32 rounded-lg bg-neutral-800 flex items-center justify-center shadow-2xl shrink-0">
            <ListMusic size={52} className="text-violet-400" />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Playlist
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-sm text-neutral-300">{playlist.description}</p>
            )}
            <p className="text-xs text-neutral-400">{songs.length} টি গান</p>
          </div>
        </div>

        <button
          onClick={handleDeletePlaylist}
          className="inline-flex items-center gap-1.5 self-start sm:self-end rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 text-xs font-semibold transition"
        >
          <Trash2 size={14} /> Delete Playlist
        </button>
      </div>

      {songs.length > 0 && (
        <button
          onClick={() => playSong(songs[0], songs)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white hover:scale-105 transition"
        >
          <Play size={16} className="fill-white" /> Play All
        </button>
      )}

      {songs.length === 0 ? (
        <p className="text-sm text-neutral-400 py-8">
          এই প্লেলিস্টে এখনো কোনো গান নেই। হোম বা সার্চ পেজ থেকে যেকোনো গানের &quot;+&quot; আইকনে ক্লিক করে গান যোগ করুন!
        </p>
      ) : (
        <div className="space-y-1">
          {songs.map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              onPlay={() => playSong(song, songs)}
              onRemove={() => handleRemoveSong(song.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}