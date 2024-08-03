import { type Video } from './media';

export interface Playlist {
  id: string;
  title: string;
  url: string;
  videos: Video[];
}
