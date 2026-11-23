"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Song } from "@/types";
import SongGrid from "@/components/SongGrid";
import AdBanner from "@/components/AdBanner";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.trim();

      let supaReq = supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (q) {
        supaReq = supaReq.or(`title.ilike.%${q}%,author.ilike.%${q}%`);
      }

      const [{ data: supaSongs }, itunesRes] = await Promise.all([
        supaReq,
        fetch(`/api/itunes?q=${encodeURIComponent(q || "Top Hindi Songs")}`).then((r) =>
          r.json()
        ),
      ]);

      const combined: Song[] = [
        ...((supaSongs as Song[]) || []),
        ...((itunesRes?.songs as Song[]) || []),
      ];

      setSongs(combined);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, supabase]);

  return (
    <div className="pt-2 space-y-6">
      <div className="relative max-w-md">
        <SearchIcon
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search music..."
          className="w-full rounded-full bg-neutral-800 border border-neutral-700 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Adsterra 320x50 Banner Ad */}
      <AdBanner
        adKey="8a5f17794df67c3b035952237c594970"
        scriptSrc="https://bauval.org/22/8a5f17794df67c3b035952237c594970"
        width={320}
        height={50}
      />

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          {query.trim() ? `"${query}"-The Resuit` : "Browse Popular Songs"}
        </h2>
        {loading ? (
          <p className="text-sm text-neutral-400">Searching...</p>
        ) : (
          <SongGrid songs={songs} />
        )}
      </div>
    </div>
  );
}