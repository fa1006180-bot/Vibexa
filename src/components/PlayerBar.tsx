"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListPlus,
} from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useModalStore } from "@/store/useModalStore";
import { useAuth } from "./AuthProvider";
import { formatTime, getMediaUrl, isYouTubeSong } from "@/lib/utils";
import LikeButton from "./LikeButton";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        options: {
          videoId: string;
          width?: string | number;
          height?: string | number;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function PlayerBar() {
  const {
    activeSong,
    isPlaying,
    volume,
    shuffle,
    repeat,
    togglePlay,
    setIsPlaying,
    playNext,
    playPrev,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const { openAddToPlaylist, openAuth } = useModalStore();
  const { user } = useAuth();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytWrapperRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);

  const [ytReady, setYtReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [prevVolume, setPrevVolume] = useState(0.8);

  const isYouTube = isYouTubeSong(activeSong);
  const songUrl = activeSong && !isYouTube ? getMediaUrl("songs", activeSong.song_path) : "";
  const imageUrl = activeSong ? getMediaUrl("images", activeSong.image_path) : "";

  // ১. HTML5 Audio (MP3 / Radio) কন্ট্রোল
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isYouTube || !songUrl) {
      audio.pause();
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, songUrl, isYouTube, setIsPlaying]);

  // ২. YouTube Player তৈরি ও পরিচালনা
  useEffect(() => {
    if (!isYouTube || !activeSong) {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
      if (ytWrapperRef.current) ytWrapperRef.current.innerHTML = "";
      setYtReady(false);
      return;
    }

    const videoId = activeSong.song_path;
    setCurrentTime(0);
    setDuration(0);

    if (ytPlayerRef.current && ytReady) {
      ytPlayerRef.current.loadVideoById(videoId);
      return;
    }

    const createPlayer = () => {
      if (!ytWrapperRef.current || !window.YT?.Player) return;
      ytWrapperRef.current.innerHTML = "";
      const target = document.createElement("div");
      ytWrapperRef.current.appendChild(target);

      ytPlayerRef.current = new window.YT.Player(target, {
        videoId,
        width: "80",
        height: "48",
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            setYtReady(true);
            ytPlayerRef.current?.setVolume(Math.round(volume * 100));
            if (usePlayerStore.getState().isPlaying) {
              ytPlayerRef.current?.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === 0) {
              const state = usePlayerStore.getState();
              if (state.repeat) {
                ytPlayerRef.current?.seekTo(0, true);
                ytPlayerRef.current?.playVideo();
              } else {
                state.playNext();
              }
            } else if (event.data === 1) {
              usePlayerStore.getState().setIsPlaying(true);
            } else if (event.data === 2) {
              usePlayerStore.getState().setIsPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSong?.id, isYouTube]);

  // ৩. YouTube Play/Pause সিঙ্ক
  useEffect(() => {
    if (!isYouTube || !ytReady || !ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.playVideo();
    } else {
      ytPlayerRef.current.pauseVideo();
    }
  }, [isPlaying, isYouTube, ytReady]);

  // ৪. YouTube সময় (Progress Bar) আপডেট
  useEffect(() => {
    if (!isYouTube || !ytReady || !isPlaying) return;
    const interval = setInterval(() => {
      if (ytPlayerRef.current) {
        setCurrentTime(ytPlayerRef.current.getCurrentTime() || 0);
        setDuration(ytPlayerRef.current.getDuration() || 0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isYouTube, ytReady, isPlaying]);

  // ৫. ভলিউম সিঙ্ক (Audio + YouTube)
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (ytPlayerRef.current && ytReady) {
      ytPlayerRef.current.setVolume(Math.round(volume * 100));
    }
  }, [volume, ytReady]);

  if (!activeSong) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (isYouTube && ytPlayerRef.current && ytReady) {
      ytPlayerRef.current.seekTo(time, true);
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleEnded = () => {
    if (repeat && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.8);
    }
  };

  return (
    <div className="fixed bottom-16 md:static left-0 right-0 w-full shrink-0 bg-black border-t border-neutral-800/80 px-4 py-3 flex items-center justify-between gap-4 z-40">
      <audio
        ref={audioRef}
        src={songUrl || undefined}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={handleEnded}
      />

      {/* বাম অংশ: গানের তথ্য, মিনি ভিডিও, Playlist ও Like বাটন */}
      <div className="flex items-center gap-3 w-[30%] min-w-[140px]">
        {isYouTube ? (
          <div
            ref={ytWrapperRef}
            className="w-20 h-12 rounded-md overflow-hidden bg-neutral-900 shrink-0 shadow"
          />
        ) : (
          <img
            src={imageUrl}
            alt={activeSong.title}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=480";
            }}
            className="h-12 w-12 rounded-md object-cover shrink-0 shadow"
          />
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{activeSong.title}</p>
          <p className="text-xs text-neutral-400 truncate">{activeSong.author}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 ml-2 shrink-0">
          <button
            onClick={() => (user ? openAddToPlaylist(activeSong) : openAuth())}
            title="Add to Playlist"
            className="text-neutral-400 hover:text-white transition"
          >
            <ListPlus size={18} />
          </button>
          <LikeButton song={activeSong} />
        </div>
      </div>

      {/* মাঝের অংশ: প্লেয়ার কন্ট্রোল ও Seekbar */}
      <div className="flex flex-col items-center max-w-[45%] w-full gap-1.5">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            title="Shuffle"
            className={`transition ${shuffle ? "text-violet-400" : "text-neutral-400 hover:text-white"}`}
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={playPrev}
            title="Previous"
            className="text-neutral-300 hover:text-white transition"
          >
            <SkipBack size={20} className="fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? (
              <Pause size={18} className="fill-black" />
            ) : (
              <Play size={18} className="fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            title="Next"
            className="text-neutral-300 hover:text-white transition"
          >
            <SkipForward size={20} className="fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            title="Repeat"
            className={`transition ${repeat ? "text-violet-400" : "text-neutral-400 hover:text-white"}`}
          >
            <Repeat size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-neutral-400 w-9 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <span className="text-[11px] text-neutral-400 w-9">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* ডান অংশ: Volume কন্ট্রোল */}
      <div className="hidden md:flex items-center justify-end gap-2 w-[25%]">
        <button onClick={toggleMute} className="text-neutral-300 hover:text-white">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>
    </div>
  );
}