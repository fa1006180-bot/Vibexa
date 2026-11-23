import { create } from "zustand";

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

  addToPlaylistSongId: string | null;
  openAddToPlaylist: (songId: string) => void;
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

  addToPlaylistSongId: null,
  openAddToPlaylist: (songId) => set({ addToPlaylistSongId: songId }),
  closeAddToPlaylist: () => set({ addToPlaylistSongId: null }),

  playlistRefreshKey: 0,
  triggerPlaylistRefresh: () =>
    set((state) => ({ playlistRefreshKey: state.playlistRefreshKey + 1 })),
}));