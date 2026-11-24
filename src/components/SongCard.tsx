"use client";

import { Play, Pause, ListPlus } from "lucide-react";
import { Song } from "@/types";
import { getMediaUrl, isYouTubeSong } from "@/lib/utils";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import LikeButton from "./LikeButton";

interface SongCardProps {
  song: Song;
  onPlay: () => void;
}

export default function SongCard({ song, onPlay }: SongCardProps) {
  const { activeSong, isPlaying, togglePlay } = usePlayerStore();
  const { openAddToPlaylist, openAuth } = useModalStore();
  const { user } = useAuth();

  const isCurrentSong = activeSong?.id === song.id;
  const imageUrl = getMediaUrl("images", song.image_path);
  const isLive = song.id.startsWith("radio-");
  const isFullYT = isYouTubeSong(song);

  const handleClick = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      onPlay();
    }
  };

  const handleAddPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return openAuth();
    openAddToPlaylist(song);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col rounded-lg bg-neutral-800/40 hover:bg-neutral-800/90 p-3.5 transition duration-300 cursor-pointer"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-neutral-900 mb-3 shadow-lg">
        <img
          src={imageUrl}
          alt={song.title}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480";
          }}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
        />

        {song.isExternal && (
          <span
            className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded font-semibold backdrop-blur-sm ${
              isFullYT || isLive
                ? "bg-emerald-500/80 text-white"
                : "bg-black/70 text-neutral-200"
            }`}
          >
            {isLive ? "LIVE" : isFullYT ? "FULL" : "30s"}
          </span>
        )}

        <button
          type="button"
          className={`absolute bottom-2.5 right-2.5 h-11 w-11 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 text-white flex items-center justify-center shadow-xl transition duration-300 hover:scale-105 ${
            isCurrentSong && isPlaying
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }`}
        >
          {isCurrentSong && isPlaying ? (
            <Pause size={20} className="fill-white" />
          ) : (
            <Play size={20} className="fill-white ml-0.5" />
          )}
        </button>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={`font-semibold text-sm truncate ${
              isCurrentSong ? "text-violet-400" : "text-white"
            }`}
          >
            {song.title}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{song.author}</p>
        </div>

        <div className="flex items-center gap-2 pt-0.5 shrink-0">
          <button
            onClick={handleAddPlaylist}
            title="Add to Playlist"
            className="text-neutral-400 hover:text-white transition"
          >
            <ListPlus size={17} />
          </button>
          <LikeButton song={song} />
        </div>
      </div>
    </div>
  );
}