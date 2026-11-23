"use client";

import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UploadModal() {
  const { isUploadOpen, closeUpload } = useModalStore();
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isUploadOpen) return null;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !songFile || !imageFile) {
      setError("সবগুলো তথ্য ও ফাইল সঠিকভাবে দিন।");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uniqueId = crypto.randomUUID();
      const songExt = songFile.name.split(".").pop();
      const imageExt = imageFile.name.split(".").pop();

      const songPath = `song-${uniqueId}.${songExt}`;
      const imagePath = `cover-${uniqueId}.${imageExt}`;

      // ১. MP3 ফাইল আপলোড
      const { data: songData, error: songError } = await supabase.storage
        .from("songs")
        .upload(songPath, songFile, { cacheControl: "3600", upsert: false });

      if (songError) throw songError;

      // ২. কভার ইমেজ আপলোড
      const { data: imageData, error: imageError } = await supabase.storage
        .from("images")
        .upload(imagePath, imageFile, { cacheControl: "3600", upsert: false });

      if (imageError) throw imageError;

      // ৩. Database-এ গানের তথ্য সেভ করা
      const { error: dbError } = await supabase.from("songs").insert({
        user_id: user.id,
        title,
        author,
        song_path: songData.path,
        image_path: imageData.path,
      });

      if (dbError) throw dbError;

      setTitle("");
      setAuthor("");
      setSongFile(null);
      setImageFile(null);
      closeUpload();
      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "আপলোড করতে সমস্যা হয়েছে!";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        <button
          onClick={closeUpload}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">নতুন গান আপলোড করুন</h2>
        <p className="text-xs text-neutral-400 mb-5">Vibexa লাইব্রেরিতে একটি MP3 গান যোগ করুন</p>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="text-xs text-neutral-300">গানের নাম (Song Title)</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: Midnight Vibe"
              className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-300">শিল্পীর নাম (Artist)</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="যেমন: Arijit Singh"
              className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-300 block mb-1">অডিও ফাইল (.mp3)</label>
            <input
              type="file"
              accept=".mp3,audio/*"
              required
              onChange={(e) => setSongFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-neutral-400 file:mr-3 file:rounded-full file:border-0 file:bg-violet-600/20 file:px-4 file:py-2 file:text-violet-400 hover:file:bg-violet-600/30 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-neutral-300 block mb-1">কভার ফটো (Image)</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-neutral-400 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-cyan-400 hover:file:bg-cyan-500/30 cursor-pointer"
            />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            <UploadCloud size={18} />
            {loading ? "আপলোড হচ্ছে..." : "আপলোড করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}