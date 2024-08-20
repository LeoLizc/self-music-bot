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

export class InvidiousService implements YTService {
  baseUrl: string = 'https://invidious.reallyaweso.me/api/v1';

  async downloadVideoUrl(url: string, _?: VideoOptions): Promise<StreamMedia> {
    const videoId: string = ytdl.getVideoID(url);
    const response = await fetch(`${this.baseUrl}/videos/${videoId}`);
    const info = await response.json();

    // with adaptativeFormats from the JSON
    // const downloadUrl =
    //   info['adaptiveFormats'].find(
    //     (x: { type: string }) => x.type === 'audio/mp4; codecs="mp4a.40.2"',
    //   ).url || info['adaptiveFormats'][0].url;

    // from HTML with scrapping
    const responseHtml = await fetch(`https://yewtu.be/watch?v=${videoId}`);
    const html = await responseHtml.text();
    // const $ = load(html);

    const root = parse(html);
    const sources = root.querySelectorAll('#player-container video source');

    if (!sources.length) {
      throw new Error('No <source/> elements found');
    }

    const source = sources[sources.length - 1];
    const eslintNoDejaPonerSrcxd = source.getAttribute('src');

    if (!eslintNoDejaPonerSrcxd) {
      throw new Error('No src attribute found in <source/> element of html');
    }

    const downloadUrl =
      'https://invidious.reallyaweso.me' + eslintNoDejaPonerSrcxd;

    const stream = await this.fetchStream(downloadUrl);

    return {
      id: info.videoId,
      stream,
      title: info.title,
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

    const response = await fetch(`${this.baseUrl}/playlists/${playlistId}`);
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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'insomnia/2023.5.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la descarga: ${response.statusText}`);
    }

    const readableStream = response.body as unknown as Readable;
    return readableStream;
  }
}
