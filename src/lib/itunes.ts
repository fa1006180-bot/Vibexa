import { Song } from "@/types";

interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
}

export async function fetchITunesSongs(query: string, limit = 15): Promise<Song[]> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      query
    )}&media=music&entity=song&country=IN&limit=${limit}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    const results: ITunesTrack[] = data.results || [];

    return results
      .filter((item) => item.previewUrl)
      .map((item) => ({
        id: `itunes-${item.trackId}`,
        user_id: "itunes",
        title: item.trackName,
        author: item.artistName,
        song_path: item.previewUrl!,
        image_path: (item.artworkUrl100 || "").replace("100x100bb", "600x600bb"),
        duration: Math.floor((item.trackTimeMillis || 30000) / 1000),
        created_at: new Date().toISOString(),
        isExternal: true,
      }));
  } catch {
    return [];
  }
}