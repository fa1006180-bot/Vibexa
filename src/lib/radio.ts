import { Song } from "@/types";

interface RadioStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved?: string;
  favicon?: string;
  tags?: string;
}

const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=480",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=480",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=480",
];

export async function fetchLiveRadioStations(tag = "", limit = 10): Promise<Song[]> {
  const servers = [
    "https://de1.api.radio-browser.info",
    "https://nl1.api.radio-browser.info",
  ];

  const params = new URLSearchParams({
    limit: String(limit * 2),
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });

  if (tag) {
    params.set("tag", tag);
  } else {
    params.set("countrycode", "IN");
  }

  for (const server of servers) {
    try {
      const res = await fetch(`${server}/json/stations/search?${params.toString()}`, {
        headers: { "User-Agent": "Vibexa/1.0" },
        next: { revalidate: 1800 },
      });

      if (!res.ok) continue;
      const stations: RadioStation[] = await res.json();

      const valid = stations
        .filter((s) => (s.url_resolved || s.url || "").startsWith("https://"))
        .slice(0, limit);

      if (valid.length === 0) continue;

      return valid.map((s, idx) => ({
        id: `radio-${s.stationuuid}`,
        user_id: "radio",
        title: s.name.trim(),
        author: s.tags
          ? s.tags
              .split(",")
              .slice(0, 2)
              .map((t) => t.trim())
              .filter(Boolean)
              .join(" • ") || "Live Music"
          : "Live 24/7 Music",
        song_path: s.url_resolved || s.url,
        image_path:
          s.favicon && s.favicon.startsWith("https://")
            ? s.favicon
            : FALLBACK_COVERS[idx % FALLBACK_COVERS.length],
        duration: 0,
        created_at: new Date().toISOString(),
        isExternal: true,
      }));
    } catch {
      continue;
    }
  }

  return [];
}