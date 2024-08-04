import { type Video as IVideo } from '../core/entities/media';
import { type VideoOptions } from '../core/entities/options';
import { type Playlist as PlayListType } from '../core/entities/playlist';
import { type YoutubeService } from '../core/services/youtube';
import { Video } from './video';
export declare class PlayList implements PlayListType {
    readonly playlist: PlayListType;
    readonly _youtubeService: YoutubeService;
    constructor(playlist: PlayListType, _youtubeService: YoutubeService, options?: VideoOptions);
    options?: VideoOptions;
    url: string;
    id: string;
    title: string;
    videos: IVideo[];
    getFormattedTitle(): string;
    getFormattedVideos(): Video[];
}
