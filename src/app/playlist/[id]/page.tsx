import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PlaylistView from "@/components/PlaylistView";
import { Playlist, Song } from "@/types";

export const dynamic = "force-dynamic";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: playlist } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", id)
    .single();

  if (!playlist) return notFound();

  const { data: playlistSongs } = await supabase
    .from("playlist_songs")
    .select("songs(*)")
    .eq("playlist_id", id)
    .order("added_at", { ascending: true });

  const songs =
    (playlistSongs as unknown as { songs: Song | null }[])
      ?.map((item) => item.songs)
      .filter((s): s is Song => s !== null) || [];

  return <PlaylistView playlist={playlist as Playlist} initialSongs={songs} />;
}