import { type Video as IVideo } from '../core/entities/media';
import { type VideoOptions } from '../core/entities/options';
import { type YoutubeService } from '../core/services/youtube';
export declare class Video implements IVideo {
    readonly video: IVideo;
    readonly _youtubeService: YoutubeService;
    readonly options?: VideoOptions | undefined;
    constructor(video: IVideo, _youtubeService: YoutubeService, options?: VideoOptions | undefined);
    duration: string | null;
    id: string;
    title: string;
    url: string;
    getStream(): Promise<import("../core/entities/media").StreamMedia>;
}
