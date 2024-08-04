"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayList = void 0;
const video_1 = require("./video");
class PlayList {
    playlist;
    _youtubeService;
    constructor(playlist, _youtubeService, options) {
        this.playlist = playlist;
        this._youtubeService = _youtubeService;
        this.id = playlist.id;
        this.title = playlist.title;
        this.videos = playlist.videos;
        this.url = playlist.url;
        this.options = options;
    }
    options;
    url;
    id;
    title;
    videos;
    getFormattedTitle() {
        return this.title.replaceAll(/[^\dA-Za-z]/gu, '-');
    }
    getFormattedVideos() {
        return this.videos.map((video) => new video_1.Video(video, this._youtubeService, this.options));
    }
}
exports.PlayList = PlayList;
