import { create } from "zustand";
import { Song } from "@/types";

interface PlayerStore {
  queue: Song[];
  activeSong: Song | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  queue: [],
  activeSong: null,
  isPlaying: false,
  volume: 0.8,
  shuffle: false,
  repeat: false,

  playSong: (song, queue) =>
    set((state) => ({
      activeSong: song,
      isPlaying: true,
      queue: queue && queue.length > 0 ? queue : state.queue.length > 0 ? state.queue : [song],
    })),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  playNext: () => {
    const { queue, activeSong, shuffle } = get();
    if (!activeSong || queue.length === 0) return;

    if (shuffle && queue.length > 1) {
      const otherSongs = queue.filter((s) => s.id !== activeSong.id);
      const randomSong = otherSongs[Math.floor(Math.random() * otherSongs.length)];
      set({ activeSong: randomSong, isPlaying: true });
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === activeSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    set({ activeSong: queue[nextIndex], isPlaying: true });
  },

  playPrev: () => {
    const { queue, activeSong } = get();
    if (!activeSong || queue.length === 0) return;

    const currentIndex = queue.findIndex((s) => s.id === activeSong.id);
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ activeSong: queue[prevIndex], isPlaying: true });
  },

  setVolume: (volume) => set({ volume }),

  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

  toggleRepeat: () => set((state) => ({ repeat: !state.repeat })),
}));