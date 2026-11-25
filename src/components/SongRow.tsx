"use client";

import { Play, Pause, Trash2, ListPlus } from "lucide-react";
import { Song } from "@/types";
import { getMediaUrl } from "@/lib/utils";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import LikeButton from "./LikeButton";

interface SongRowProps {
  song: Song;
  index: number;
  onPlay: () => void;
  onRemove?: () => void;
}

export default function SongRow({ song, index, onPlay, onRemove }: SongRowProps) {
  const { activeSong, isPlaying, togglePlay } = usePlayerStore();
  const { openAddToPlaylist, openAuth } = useModalStore();
  const { user } = useAuth();

  const isCurrentSong = activeSong?.id === song.id;
  const imageUrl = getMediaUrl("images", song.image_path);

  const handleRowClick = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      onPlay();
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className="group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800/70 transition cursor-pointer"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-5 text-center text-xs text-neutral-400 shrink-0">
          <span className="group-hover:hidden">
            {isCurrentSong && isPlaying ? "▶" : index + 1}
          </span>
          <span className="hidden group-hover:inline text-white">
            {isCurrentSong && isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </span>
        </div>

        <img
          src={imageUrl}
          alt={song.title}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480";
          }}
          className="h-11 w-11 rounded object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium truncate ${
              isCurrentSong ? "text-violet-400" : "text-white"
            }`}
          >
            {song.title}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{song.author}</p>
        </div>
      </div>

      <div className="flex items-center gap-3.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) return openAuth();
            openAddToPlaylist(song);
          }}
          title="Add to Playlist"
          className="text-neutral-400 hover:text-white transition"
        >
          <ListPlus size={19} />
        </button>

        <LikeButton song={song} />

        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            title="Remove from playlist"
            className="text-neutral-400 hover:text-red-400 transition"
          >
            <Trash2 size={17} />
          </button>
        )}
      </div>
    </div>
  );
}