import { createClient } from "@/lib/supabase/server";
import { fetchYouTubeSongs } from "@/lib/youtube";
import { fetchITunesSongs } from "@/lib/itunes";
import { fetchLiveRadioStations } from "@/lib/radio";
import SongGrid from "@/components/SongGrid";
import AdBanner from "@/components/AdBanner";
import { Song } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: uploadedSongs },
    ytBollywood,
    ytBengali,
    ytGlobal,
    indianNonStop,
  ] = await Promise.all([
    supabase
  .from("songs")
  .select("*")
  .or("is_external.is.null,is_external.eq.false")
  .order("created_at", { ascending: false }),
    fetchYouTubeSongs("Arijit Singh Bollywood Hits", 10),
    fetchYouTubeSongs("Best Bengali Songs Anupam Roy", 10),
    fetchYouTubeSongs("Top Global Pop Hits", 10),
    fetchLiveRadioStations("", 10),
  ]);

  const mySongs = (uploadedSongs as Song[]) || [];
  const fallbackBollywood =
    ytBollywood.length > 0 ? ytBollywood : await fetchITunesSongs("Arijit Singh", 10);

  return (
    <div className="pt-2 space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-violet-900/50 via-neutral-900 to-cyan-900/40 border border-white/5 p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Discover Your Vibe on Vibexa 🎧
        </h1>
        <p className="text-sm text-neutral-300 mt-1">
         Enjoy Bengali,Hindi & English
        </p>
      </div>

      {mySongs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Your Uploaded Full Songs</h2>
          <SongGrid songs={mySongs} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Bollywood Full Hits</h2>
        <SongGrid songs={fallbackBollywood} />
      </div>

      {/* Adsterra 320x50 Banner Ad */}
      

      {ytBengali.length > 0 && (
        <div>
<h2 className="text-xl font-bold text-white mb-4">Bengali Full Hits</h2>
          <SongGrid songs={ytBengali} />
        </div>
      )}

      {ytGlobal.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Global Full Hits</h2>
          <SongGrid songs={ytGlobal} />
        </div>
      )}

      {indianNonStop.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">24/7 Live Music Radio</h2>
          <SongGrid songs={indianNonStop} />
        </div>
      )}
    </div>
  );
}