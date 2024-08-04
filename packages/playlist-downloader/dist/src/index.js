"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = exports.PlayList = exports.pldl = void 0;
const youtube_1 = require("./infrastructure/service/youtube");
const playlist_1 = require("./interface/playlist");
const service = new youtube_1.YoutubeService();
const pldl = async (url, options) => {
    const playlist = await service.getPlaylist(url);
    return new playlist_1.PlayList(playlist, service, options);
};
exports.pldl = pldl;
exports.pldl.service = service;
var playlist_2 = require("./interface/playlist");
Object.defineProperty(exports, "PlayList", { enumerable: true, get: function () { return playlist_2.PlayList; } });
var video_1 = require("./interface/video");
Object.defineProperty(exports, "Video", { enumerable: true, get: function () { return video_1.Video; } });
