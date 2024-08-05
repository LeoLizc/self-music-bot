import { type StreamMedia, type Video } from '../entities/media';
import { type PlaylistOptions, type VideoOptions } from '../entities/options';
import { type Playlist } from '../entities/playlist';

export interface YoutubeService {
  downloadVideo: (video: Video, options?: VideoOptions) => Promise<StreamMedia>;

  downloadVideoUrl: (
    videoId: string,
    options?: VideoOptions,
  ) => Promise<StreamMedia>;

  getPlaylist: (
    playlistId: string,
    options?: PlaylistOptions,
  ) => Promise<Playlist>;

  getVideo: (videoId: string) => Promise<Video>;

  validatePlaylistUrl: (url: string) => boolean;

  validateVideoUrl: (url: string) => boolean;
}
