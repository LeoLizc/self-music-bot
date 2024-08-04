import { type VideoOptions } from './core/entities/options';
import { YoutubeService } from './infrastructure/service/youtube';
import { PlayList } from './interface/playlist';
export declare const pldl: {
    (url: string, options?: VideoOptions): Promise<PlayList>;
    service: YoutubeService;
};
export { PlayList } from './interface/playlist';
export { Video } from './interface/video';
