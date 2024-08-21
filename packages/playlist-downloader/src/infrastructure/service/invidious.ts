// eslint-disable-next-line simple-import-sort/imports
import { parse } from 'node-html-parser';
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
import { fetchWithTimeout } from '../../utils/fetch';

export class InvidiousService implements YTService {
  private readonly baseUrls: string[] = [
    'https://invidious.privacyredirect.com',
    'https://invidious.jing.rocks',
    'https://iv.ggtyler.dev',
    // 'https://inv.tux.pizza',
  ];

  private baseUrlIndex: number = 0;
  private apiBaseUrlIndex: number = 0;

  private get baseUrl(): string {
    return this.baseUrls[this.baseUrlIndex];
  }

  private get apiBaseUrl(): string {
    return `${this.baseUrls[this.apiBaseUrlIndex]}/api/v1`;
  }

  private nextBaseUrl() {
    this.baseUrlIndex = (this.baseUrlIndex + 1) % this.baseUrls.length;
  }

  private nextApiBaseUrl() {
    this.apiBaseUrlIndex = (this.apiBaseUrlIndex + 1) % this.baseUrls.length;
  }

  async downloadVideoUrl(url: string, _?: VideoOptions): Promise<StreamMedia> {
    const videoId: string = ytdl.getVideoID(url);

    let responseApiVideo;
    const numberAttempts1 = this.baseUrls.length; // max times to make the request - at least 1
    let errorApiVideo;

    for (let index = 0; index < numberAttempts1; index++) {
      try {
        responseApiVideo = await fetch(`${this.apiBaseUrl}/videos/${videoId}`);
        errorApiVideo = undefined;
        break;
      } catch (error) {
        errorApiVideo = error;
        this.nextApiBaseUrl();
      }
    }

    if (errorApiVideo || !responseApiVideo) {
      throw errorApiVideo;
    }

    const videoInfo = await responseApiVideo.json();

    const numberAttemptsHtml = 2; // max times to make the request - at least 1
    let errorHtml;
    let endpointVideoResource;

    for (let index = 0; index < numberAttemptsHtml; index++) {
      try {
        const videoUrlInvidious = `${this.baseUrl}/watch?v=${videoId}`;
        console.log(`Fetching ${videoUrlInvidious}`);

        const responseHtml = await fetchWithTimeout(`${videoUrlInvidious}`, {
          timeout: 8_000,
        });
        const html = (await responseHtml!.text()).trim();

        if (!html) {
          throw new Error(`Empty HTML received for ${videoUrlInvidious}`);
        }

        const root = parse(html);
        const element = root.querySelector(
          '#player-container video source:last-of-type',
        );

        if (!element) {
          throw new Error('No <source/> element found');
        }

        endpointVideoResource = element.getAttribute('src');
        if (!endpointVideoResource) {
          throw new Error('Empty src attribute in </source> element');
        }

        errorHtml = undefined;
        break;
      } catch (error) {
        // if (error instanceof Error && error.name === 'AbortError') {}
        errorHtml = error;
        this.nextBaseUrl();
      }
    }

    if (errorHtml) {
      throw errorHtml;
    }

    const downloadUrl = `${this.baseUrl}${endpointVideoResource}`;
    const stream = await this.fetchStream(downloadUrl);

    return {
      id: videoInfo.videoId,
      stream,
      title: videoInfo.title,
      url,
    };
  }

  async downloadVideo(video: Video): Promise<StreamMedia> {
    const stream = await this.fetchStream(video.url);

    return {
      id: video.id,
      stream,
      title: video.title,
      url: video.url,
    };
  }

  async getPlaylist(url: string, _?: PlaylistOptions): Promise<Playlist> {
    const playlistId: string = await ytpl.getPlaylistID(url);

    console.log(`Getting playlist ${this.apiBaseUrl}/playlists/${playlistId}`);
    const response = await fetch(`${this.apiBaseUrl}/playlists/${playlistId}`);
    const playlist = await response.json();

    return {
      id: playlist.playlistId,
      title: playlist.title,
      url,
      videos: playlist.videos.map((video: Record<string, unknown>) => ({
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

  async fetchStream(url: string): Promise<Readable> {
    console.log('fetchStream', url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error en la descarga: ${response.statusText}`);
    }

    const readableStream = response.body as unknown as Readable;
    return readableStream;
  }
}
