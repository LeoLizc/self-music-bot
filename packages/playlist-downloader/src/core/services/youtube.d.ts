import { type StreamMedia, type Video } from '../entities/media';
import { type PlaylistOptions } from '../entities/options';
import { type Playlist } from '../entities/playlist';

export interface YoutubeService {
  downloadVideo: (videoId: string) => Promise<StreamMedia>;

  getPlaylist: (
    playlistId: string,
    options?: PlaylistOptions,
  ) => Promise<Playlist>;

  getVideo: (videoId: string) => Promise<Video>;
}
