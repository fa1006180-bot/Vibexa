export interface Song {
  id: string;
  user_id: string;
  author: string;
  title: string;
  song_path: string;
  image_path: string;
  duration: number;
  created_at: string;
  isExternal?: boolean;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_path?: string;
  created_at: string;
}