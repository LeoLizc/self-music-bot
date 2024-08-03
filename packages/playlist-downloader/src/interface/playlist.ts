import { type Video } from '../core/entities/media';
import { type VideoOptions } from '../core/entities/options';
import { type Playlist as PlayListType } from '../core/entities/playlist';

export class PlayList implements PlayListType {
  constructor(
    readonly playlist: PlayListType,
    options: VideoOptions,
  ) {
    this.id = playlist.id;
    this.title = playlist.title;
    this.videos = playlist.videos;
    this.url = playlist.url;
    this.options = options;
  }

  options: VideoOptions;
  url: string;
  id: string;
  title: string;
  videos: Video[];

  getFormattedTitle(): string {
    return this.title.replaceAll(/[^\dA-Za-z]/gu, '-');
  }

  getFormattedVideos() {}
}
