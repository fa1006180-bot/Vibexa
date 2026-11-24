import { createClient } from "@/lib/supabase/client";
import { Song } from "@/types";

export async function ensureSongInDb(song: Song, userId: string): Promise<string | null> {
  if (!song.isExternal) {
    return song.id;
  }

  const supabase = createClient();

  const { data: existing, error: findError } = await supabase
    .from("songs")
    .select("id")
    .eq("song_path", song.song_path)
    .maybeSingle();

  if (findError) {
    alert("Check error: " + findError.message);
    return null;
  }

  if (existing?.id) {
    return existing.id;
  }

  const { data: inserted, error: insertError } = await supabase
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

  if (insertError || !inserted) {
    alert("Save error: " + (insertError?.message || "Unknown error"));
    return null;
  }

  return inserted.id;
}