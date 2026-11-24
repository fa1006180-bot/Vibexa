"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "next/navigation";
import { Song } from "@/types";
import { ensureSongInDb } from "@/lib/ensureSongInDb";

export default function LikeButton({ song }: { song: Song }) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();
  const { openAuth } = useModalStore();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) {
      setIsLiked(false);
      return;
    }

    const checkLike = async () => {
      let targetSongId: string | null = song.id;

      if (song.isExternal) {
        const { data: existing } = await supabase
          .from("songs")
          .select("id")
          .eq("song_path", song.song_path)
          .maybeSingle();
        targetSongId = existing?.id || null;
      }

      if (!targetSongId) {
        setIsLiked(false);
        return;
      }

      const { data } = await supabase
        .from("liked_songs")
        .select("song_id")
        .eq("user_id", user.id)
        .eq("song_id", targetSongId)
        .maybeSingle();

      setIsLiked(!!data);
    };

    checkLike();
  }, [song.id, song.song_path, song.isExternal, user?.id, supabase]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return openAuth();

    const realSongId = await ensureSongInDb(song, user.id);
    if (!realSongId) return;

    if (isLiked) {
      setIsLiked(false);
      await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", realSongId);
    } else {
      setIsLiked(true);
      await supabase
        .from("liked_songs")
        .insert({ user_id: user.id, song_id: realSongId });
    }
    router.refresh();
  };

  return (
    <button
      onClick={handleLike}
      title={isLiked ? "Unlike" : "Like"}
      className="hover:scale-110 transition"
    >
      <Heart
        size={18}
        className={isLiked ? "text-violet-500 fill-violet-500" : "text-neutral-400 hover:text-white"}
      />
    </button>
  );
}