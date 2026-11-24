"use client";

import { useState } from "react";
import { X, ListMusic } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PlaylistModal() {
  const { isPlaylistOpen, closePlaylist, triggerPlaylistRefresh } = useModalStore();
  const { user } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPlaylistOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    setError(null);

    const { data, error: dbError } = await supabase
      .from("playlists")
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
      })
      .select()
      .single();

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    setName("");
    setDescription("");
    closePlaylist();
    triggerPlaylistRefresh();
    if (data?.id) {
      router.push(`/playlist/${data.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        <button
          onClick={closePlaylist}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center">
            <ListMusic className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Create a new playlist</h2>
            <p className="text-xs text-neutral-400">Organize your favorite songs into a collection</p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-300">Playlist (Name)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: Late Night Chill"
              className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-300">Description (Optional)</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something about this playlist..."
              className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
}