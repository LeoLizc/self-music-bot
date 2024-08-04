"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const ytpl_1 = __importDefault(require("@distube/ytpl"));
const ytdl_core_1 = __importDefault(require("@distube/ytdl-core"));
class YoutubeService {
    async downloadVideoUrl(videoUrl, options) {
        const stream = (0, ytdl_core_1.default)(videoUrl, options);
        const info = await ytdl_core_1.default.getBasicInfo(videoUrl);
        return {
            id: info.videoDetails.videoId,
            stream,
            title: info.videoDetails.title,
            url: info.videoDetails.video_url,
        };
    }
    async downloadVideo(video, options) {
        const stream = (0, ytdl_core_1.default)(video.url, options);
        return {
            id: video.id,
            stream,
            title: video.title,
            url: video.url,
        };
    }
    async getPlaylist(url, options) {
        const playlist = await (0, ytpl_1.default)(url, options);
        return {
            id: playlist.id,
            title: playlist.title,
            url: playlist.url,
            videos: playlist.items.map((video) => {
                return {
                    duration: video.duration,
                    id: video.id,
                    title: video.title,
                    url: video.url,
                };
            }),
        };
    }
    async getVideo(videoUrl) {
        const info = await ytdl_core_1.default.getBasicInfo(videoUrl);
        return {
            duration: info.videoDetails.lengthSeconds,
            id: info.videoDetails.videoId,
            title: info.videoDetails.title,
            url: info.videoDetails.video_url,
        };
    }
}
exports.YoutubeService = YoutubeService;
