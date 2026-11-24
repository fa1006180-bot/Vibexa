import { create } from "zustand";
import { Song } from "@/types";

interface ModalStore {
  isAuthOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;

  isUploadOpen: boolean;
  openUpload: () => void;
  closeUpload: () => void;

  isPlaylistOpen: boolean;
  openPlaylist: () => void;
  closePlaylist: () => void;

  addToPlaylistSong: Song | null;
  openAddToPlaylist: (song: Song) => void;
  closeAddToPlaylist: () => void;

  playlistRefreshKey: number;
  triggerPlaylistRefresh: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isAuthOpen: false,
  openAuth: () => set({ isAuthOpen: true }),
  closeAuth: () => set({ isAuthOpen: false }),

  isUploadOpen: false,
  openUpload: () => set({ isUploadOpen: true }),
  closeUpload: () => set({ isUploadOpen: false }),

  isPlaylistOpen: false,
  openPlaylist: () => set({ isPlaylistOpen: true }),
  closePlaylist: () => set({ isPlaylistOpen: false }),

  addToPlaylistSong: null,
  openAddToPlaylist: (song) => set({ addToPlaylistSong: song }),
  closeAddToPlaylist: () => set({ addToPlaylistSong: null }),

  playlistRefreshKey: 0,
  triggerPlaylistRefresh: () =>
    set((state) => ({ playlistRefreshKey: state.playlistRefreshKey + 1 })),
}));