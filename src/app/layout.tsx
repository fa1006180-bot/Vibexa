import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import UploadModal from "@/components/UploadModal";
import PlaylistModal from "@/components/PlaylistModal";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import PlayerBar from "@/components/PlayerBar";
import MobileNav from "@/components/MobileNav";
import RegisterSW from "@/components/RegisterSW";
import SplashAd from "@/components/SplashAd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vibexa | Stream Your Vibe",
  description: "Full-stack music streaming app built with Next.js & Supabase",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-black text-white min-h-dvh md:h-screen md:overflow-hidden flex flex-col`}
      >
        <RegisterSW />
        <SplashAd />
        <AuthProvider>
          <AuthModal />
          <UploadModal />
          <PlaylistModal />
          <AddToPlaylistModal />

          <div className="flex flex-1 min-h-0 bg-black md:overflow-hidden">
            <Sidebar />
            <main className="flex-1 min-h-dvh md:min-h-0 md:my-2 md:mr-2 bg-neutral-900 md:rounded-lg md:overflow-y-auto relative">
              <Header />
              <div className="px-4 sm:px-6 pb-40 md:pb-24">{children}</div>
            </main>
          </div>

          <PlayerBar />
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}