import { Song } from "@/types";

interface YTItem {
  id: { videoId?: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails?: {
      high?: { url: string };
      medium?: { url: string };
    };
  };
}

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function fetchYouTubeSongs(query: string, limit = 10): Promise<Song[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      part: "snippet",
      type: "video",
      videoCategoryId: "10",
      videoEmbeddable: "true",
      maxResults: String(limit),
      q: `${query} song`,
      key: apiKey,
    });

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
      { next: { revalidate: 21600 } } // ৬ ঘণ্টা ক্যাশ থাকবে, যাতে API কোটা বেঁচে যায়
    );

    if (!res.ok) return [];
    const data = await res.json();
    const items: YTItem[] = data.items || [];

    return items
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        id: `yt-${item.id.videoId}`,
        user_id: "youtube",
        title: decodeHtml(item.snippet.title),
        author: decodeHtml(item.snippet.channelTitle),
        song_path: item.id.videoId!,
        image_path:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480",
        duration: 0,
        created_at: new Date().toISOString(),
        isExternal: true,
      }));
  } catch {
    return [];
  }
}