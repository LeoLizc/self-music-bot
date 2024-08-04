import { type StreamMedia, type Video } from '../../core/entities/media';
import { type VideoOptions, type PlaylistOptions } from '../../core/entities/options';
import { type Playlist } from '../../core/entities/playlist';
import { type YoutubeService as YTService } from '../../core/services/youtube';
export declare class YoutubeService implements YTService {
    downloadVideoUrl(videoUrl: string, options?: VideoOptions): Promise<StreamMedia>;
    downloadVideo(video: Video, options?: VideoOptions): Promise<StreamMedia>;
    getPlaylist(url: string, options?: PlaylistOptions): Promise<Playlist>;
    getVideo(videoUrl: string): Promise<Video>;
}
