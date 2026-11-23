import { NextRequest, NextResponse } from "next/server";
import { fetchYouTubeSongs } from "@/lib/youtube";
import { fetchITunesSongs } from "@/lib/itunes";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "Arijit Singh";

  const ytSongs = await fetchYouTubeSongs(q, 15);
  if (ytSongs.length > 0) {
    return NextResponse.json({ songs: ytSongs });
  }

  const itunesSongs = await fetchITunesSongs(q, 15);
  return NextResponse.json({ songs: itunesSongs });
}