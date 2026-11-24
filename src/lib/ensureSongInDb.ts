import { createClient } from "@/lib/supabase/client";
import { Song } from "@/types";

export async function ensureSongInDb(song: Song, userId: string): Promise<string | null> {
  if (!song.isExternal) {
    return song.id;
  }

  const supabase = createClient();

  const { data: existing } = await supabase
    .from("songs")
    .select("id")
    .eq("song_path", song.song_path)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data: inserted, error } = await supabase
    .from("songs")
    .insert({
      user_id: userId,
      title: song.title,
      author: song.author,
      song_path: song.song_path,
      image_path: song.image_path,
      duration: song.duration || 0,
      is_external: true,
    })
    .select("id")
    .single();

  if (error || !inserted) return null;
  return inserted.id;
}