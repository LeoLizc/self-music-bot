import { type Video as IVideo } from '../core/entities/media';
import { type VideoOptions } from '../core/entities/options';
import { type Playlist as PlayListType } from '../core/entities/playlist';
import { type YoutubeService } from '../core/services/youtube';
import { Video } from './video';

export class PlayList implements PlayListType {
  constructor(
    readonly playlist: PlayListType,
    readonly _youtubeService: YoutubeService,
    options?: VideoOptions,
  ) {
    this.id = playlist.id;
    this.title = playlist.title;
    this.videos = playlist.videos;
    this.url = playlist.url;
    this.options = options;
  }

  options?: VideoOptions;
  url: string;
  id: string;
  title: string;
  videos: IVideo[];

  getFormattedTitle(): string {
    return this.title.replaceAll(/[^\dA-Za-z]/gu, '-');
  }

  getFormattedVideos() {
    return this.videos.map(
      (video) => new Video(video, this._youtubeService, this.options),
    );
  }
}
