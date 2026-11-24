import { Song } from "@/types";

export function getMediaUrl(bucket: "songs" | "images", path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function isYouTubeSong(song: Song | null): boolean {
  if (!song) return false;
  if (song.id.startsWith("yt-")) return true;
  return !song.song_path.startsWith("http") && !song.song_path.includes(".");
}

export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}