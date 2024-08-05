import { type Video as IVideo } from '../core/entities/media';
import { type VideoOptions } from '../core/entities/options';
import { type YoutubeService } from '../core/services/youtube';

export class Video implements IVideo {
  constructor(
    readonly video: IVideo,
    readonly _youtubeService: YoutubeService,
    readonly options?: VideoOptions,
  ) {
    this.duration = video.duration;
    this.id = video.id;
    this.title = video.title;
    this.url = video.url;
  }

  duration: string | null;
  id: string;
  title: string;
  url: string;

  getStream() {
    return this._youtubeService.downloadVideo(this.video, this.options);
  }

  getFormatedTitle() {
    return this.title
      .replaceAll(/[^\d\sA-Za-zÁÉÍÑÓÚÜáéíñóúü]/gu, '')
      .replaceAll(/\s+/gu, ' ')
      .trim();
  }
}
