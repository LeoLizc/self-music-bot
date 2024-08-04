"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
class Video {
    video;
    _youtubeService;
    options;
    constructor(video, _youtubeService, options) {
        this.video = video;
        this._youtubeService = _youtubeService;
        this.options = options;
        this.duration = video.duration;
        this.id = video.id;
        this.title = video.title;
        this.url = video.url;
    }
    duration;
    id;
    title;
    url;
    getStream() {
        return this._youtubeService.downloadVideo(this.video, this.options);
    }
}
exports.Video = Video;
