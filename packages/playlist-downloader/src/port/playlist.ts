import { type Video } from '../entities/media';
import { type Playlist as PlayListType } from '../entities/playlist';

export class PlayList implements PlayListType {
  constructor(readonly playlist: PlayListType) {
    this.id = playlist.id;
    this.title = playlist.title;
    this.videos = playlist.videos;
    this.url = playlist.url;
  }

  url: string;
  id: string;
  title: string;
  videos: Video[];

  getFormattedTitle(): string {
    return this.title.replaceAll(/[^\dA-Za-z]/gu, '-');
  }

  getFormattedVideos() {}
}
