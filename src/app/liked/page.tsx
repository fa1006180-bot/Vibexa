"use client";

import { useEffect, useState } from "react";
import { Heart, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useModalStore } from "@/store/useModalStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types";
import SongRow from "@/components/SongRow";

export default function LikedSongsPage() {
  const { user, isLoading } = useAuth();
  const { openAuth } = useModalStore();
  const { playSong } = usePlayerStore();
  const supabase = createClient();

  const [songs, setSongs] = useState<Song[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setFetching(false);
      return;
    }

    const fetchLiked = async () => {
      const { data } = await supabase
        .from("liked_songs")
        .select("songs(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const extracted =
        (data as unknown as { songs: Song | null }[])
          ?.map((item) => item.songs)
          .filter((s): s is Song => s !== null) || [];

      setSongs(extracted);
      setFetching(false);
    };

    fetchLiked();
  }, [user?.id, supabase]);

  if (!isLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <Heart size={48} className="text-violet-500" />
        <h2 className="text-xl font-bold text-white">Log in to view your favorite songs.</h2>
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
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-5 rounded-xl bg-gradient-to-b from-violet-700/70 to-neutral-900 p-6">
        <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center shadow-2xl shrink-0">
          <Heart size={52} className="text-white fill-white" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
            Playlist
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Liked Songs</h1>
          <p className="text-sm text-neutral-300">{songs.length} Songs</p>
        </div>
      </div>

      {songs.length > 0 && (
        <button
          onClick={() => playSong(songs[0], songs)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white hover:scale-105 transition"
        >
          <Play size={16} className="fill-white" /> Play All
        </button>
      )}

      {fetching ? (
        <p className="text-sm text-neutral-400">Loading...</p>
      ) : songs.length === 0 ? (
        <p className="text-sm text-neutral-400 py-8">
          You haven’t liked any songs yet. Click the heart icon next to a song!
        </p>
      ) : (
        <div className="space-y-1">
          {songs.map((song, idx) => (
            <SongRow
              key={song.id}
              song={song}
              index={idx}
              onPlay={() => playSong(song, songs)}
            />
          ))}
        </div>
      )}
    </div>
  );
}