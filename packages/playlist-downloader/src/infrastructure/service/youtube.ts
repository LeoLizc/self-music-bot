// eslint-disable-next-line simple-import-sort/imports
import { type StreamMedia, type Video } from '../../core/entities/media';
import {
  type VideoOptions,
  type PlaylistOptions,
} from '../../core/entities/options';
import { type Playlist } from '../../core/entities/playlist';
import { type YoutubeService as YTService } from '../../core/services/youtube';

import ytpl from '@distube/ytpl';
import ytdl from '@distube/ytdl-core';

export class YoutubeService implements YTService {
  async downloadVideoUrl(
    videoUrl: string,
    options?: VideoOptions,
  ): Promise<StreamMedia> {
    const stream = ytdl(videoUrl, options);

    const info = await ytdl.getBasicInfo(videoUrl);
    return {
      id: info.videoDetails.videoId,
      stream,
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
    };
  }

  async downloadVideo(
    video: Video,
    options?: VideoOptions,
  ): Promise<StreamMedia> {
    const stream = ytdl(video.url, options);
    return {
      id: video.id,
      stream,
      title: video.title,
      url: video.url,
    };
  }

  async getPlaylist(url: string, options?: PlaylistOptions): Promise<Playlist> {
    const playlist = await ytpl(url, options);
    return {
      id: playlist.id,
      title: playlist.title,
      url: playlist.url,
      videos: playlist.items.map((video) => {
        return {
          duration: video.duration,
          id: video.id,
          title: video.title,
          url: video.url,
        };
      }),
    };
  }

  async getVideo(videoUrl: string): Promise<Video> {
    const info = await ytdl.getBasicInfo(videoUrl);
    return {
      duration: info.videoDetails.lengthSeconds,
      id: info.videoDetails.videoId,
      title: info.videoDetails.title,
      url: info.videoDetails.video_url,
    };
  }
}
