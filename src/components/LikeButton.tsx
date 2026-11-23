"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";
import { useModalStore } from "@/store/useModalStore";
import { useRouter } from "next/navigation";

export default function LikeButton({ songId }: { songId: string }) {
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
      const { data } = await supabase
        .from("liked_songs")
        .select("song_id")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .maybeSingle();

      setIsLiked(!!data);
    };

    checkLike();
  }, [songId, user?.id, supabase]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return openAuth();

    if (isLiked) {
      setIsLiked(false);
      await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);
    } else {
      setIsLiked(true);
      await supabase
        .from("liked_songs")
        .insert({ user_id: user.id, song_id: songId });
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