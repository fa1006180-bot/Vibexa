"use client";

import { useEffect, useState } from "react";
import { Disc3, ArrowRight } from "lucide-react";
import AdBanner from "./AdBanner";

export default function SplashAd() {
  const [show, setShow] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("vibexa_splash_shown");
    if (!alreadyShown) {
      setShow(true);
      sessionStorage.setItem("vibexa_splash_shown", "1");
    }
  }, []);

  useEffect(() => {
    if (!show || secondsLeft <= 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [show, secondsLeft]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-between px-6 py-10 text-white">
      {/* উপরে: Vibexa লোগো */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-lg">
          <Disc3 size={30} className="text-white animate-spin" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Vibexa</h1>
        <p className="text-xs text-neutral-400">Loading your music experience...</p>
      </div>

      {/* মাঝখানে: Adsterra বিজ্ঞাপন */}
      <div className="w-full max-w-sm flex flex-col items-center my-6">
        <AdBanner
          adKey="8a5f17794df67c3b035952237c594970"
          scriptSrc="https://bauval.org/22/8a5f17794df67c3b035952237c594970"
          width={320}
          height={50}
        />
      </div>

      {/* নিচে: Continue বাটন */}
      <div className="mb-4">
        {secondsLeft > 0 ? (
          <div className="rounded-full bg-neutral-900 border border-neutral-800 px-6 py-2.5 text-xs font-medium text-neutral-400">
            Please wait{secondsLeft} Second...
          </div>
        ) : (
          <button
            onClick={() => setShow(false)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3 text-sm font-bold text-white shadow-lg hover:scale-105 transition"
          >
            Continue to Vibexa
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}