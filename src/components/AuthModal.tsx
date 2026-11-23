"use client";

import { useState } from "react";
import { X, Disc3 } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { createClient } from "@/lib/supabase/client";

export default function AuthModal() {
  const { isAuthOpen, closeAuth } = useModalStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("অ্যাকাউন্ট তৈরি হয়েছে! লগ-ইন করে নিন বা ইমেইল চেক করুন।");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        closeAuth();
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        <button
          onClick={closeAuth}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center mb-3">
            <Disc3 className="text-white animate-spin-slow" size={26} />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isSignUp ? "Vibexa-তে অ্যাকাউন্ট খুলুন" : "Vibexa-তে স্বাগতম"}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            {isSignUp ? "আপনার পছন্দের গান শুনতে জয়েন করুন" : "চালিয়ে যেতে লগ-ইন করুন"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-300">ইমেইল (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300">পাসওয়ার্ড (Password)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded">{error}</p>}
          {message && <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 py-2.5 font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "অপেক্ষা করুন..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-neutral-400">
          {isSignUp ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "নতুন ইউজার?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-violet-400 hover:underline font-medium"
          >
            {isSignUp ? "Log in করুন" : "Sign up করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}