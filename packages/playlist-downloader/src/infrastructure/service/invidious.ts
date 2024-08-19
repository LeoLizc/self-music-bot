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
import { type Readable } from 'stream';

export class InvidiousService implements YTService {
  baseUrl: string = 'https://invidious.reallyaweso.me/api/v1';

  async downloadVideoUrl(url: string, _?: VideoOptions): Promise<StreamMedia> {
    const videoId: string = ytdl.getVideoID(url);
    const response = await fetch(`${this.baseUrl}/videos/${videoId}`);
    const info = await response.json();
    const stream = await this.fetchStream(videoId);

    return {
      id: info.videoId,
      stream,
      title: info.title,
      url:
        info.adaptiveFormats.find(
          (format: { type: string }) =>
            format.type === 'audio/mp4; codecs="mp4a.40.2"',
        )?.url || info.adaptiveFormats[0].url,
    };
  }

  async downloadVideo(video: Video): Promise<StreamMedia> {
    const videoId: string = ytdl.getVideoID(video.url);
    const stream = await this.fetchStream(videoId);

    return {
      id: video.id,
      stream,
      title: video.title,
      url: video.url,
    };
  }

  async getPlaylist(url: string, _?: PlaylistOptions): Promise<Playlist> {
    const playlistId: string = await ytpl.getPlaylistID(url);
    const response = await fetch(`${this.baseUrl}/playlists/${playlistId}`);
    const playlist = await response.json();

    return {
      id: playlist.playlistId,
      title: playlist.title,
      url,
      videos: playlist.items.map((video: Record<string, unknown>) => ({
        duration: video.lengthSeconds,
        id: video.videoId,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.videoId}`,
      })),
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

  validatePlaylistUrl(url: string): boolean {
    return ytpl.validateID(url);
  }

  validateVideoUrl(url: string): boolean {
    return ytdl.validateURL(url);
  }

  async fetchStream(videoId: string): Promise<Readable> {
    const response = await fetch(`${this.baseUrl}/videos/${videoId}`);

    if (!response.ok) {
      throw new Error(`Error en la descarga: ${response.statusText}`);
    }

    const readableStream = response.body as unknown as Readable;
    return readableStream;
  }
}
