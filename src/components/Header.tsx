"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Upload, LogOut, User as UserIcon } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const router = useRouter();
  const { openAuth, openUpload } = useModalStore();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-violet-950/80 to-transparent backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="h-8 w-8 rounded-full bg-black/70 flex items-center justify-center text-neutral-300 hover:text-white transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => router.forward()}
          className="h-8 w-8 rounded-full bg-black/70 flex items-center justify-center text-neutral-300 hover:text-white transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={openUpload}
              className="flex items-center gap-2 rounded-full bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-white transition"
            >
              <Upload size={14} />
              Upload Song
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-neutral-300">
              <UserIcon size={14} className="text-violet-400" />
              <span className="max-w-[120px] truncate">{user.email}</span>
            </div>
            <button
              onClick={signOut}
              title="Log out"
              className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={openAuth}
              className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:scale-105 transition"
            >
              Log in
            </button>
          </>
        )}
      </div>
    </header>
  );
}