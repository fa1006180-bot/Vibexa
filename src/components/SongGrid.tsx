"use client";

import { Music } from "lucide-react";
import { Song } from "@/types";
import { usePlayerStore } from "@/store/usePlayerStore";
import SongCard from "./SongCard";

export default function SongGrid({ songs }: { songs: Song[] }) {
  const { playSong } = usePlayerStore();

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
          <Music className="text-violet-400" size={30} />
        </div>
        <h3 className="text-lg font-semibold text-white">এখনো কোনো গান আপলোড করা হয়নি</h3>
        <p className="text-sm text-neutral-400 mt-1">
          উপরের &quot;Upload Song&quot; বাটনে ক্লিক করে প্রথম গানটি আপলোড করুন!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          onPlay={() => playSong(song, songs)}
        />
      ))}
    </div>
  );
}