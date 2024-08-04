"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("@distube/ytdl-core"));
const ytpl_1 = __importDefault(require("@distube/ytpl"));
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
const sanitizeFileName = (name) => {
    return name.replaceAll(/["*/:<>?\\|]/gu, '');
};
const downloadAndConvertToMp3 = (url, outputPath) => {
    return new Promise((resolve, reject) => {
        if (url instanceof URL) {
            url = url.toString();
        }
        const stream = (0, ytdl_core_1.default)(url, { filter: 'audioonly' });
        (0, fluent_ffmpeg_1.default)(stream)
            .audioBitrate(128)
            .toFormat('mp3')
            .save(outputPath)
            .on('end', () => {
            resolve(true);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
};
// eslint-disable-next-line @typescript-eslint/no-shadow
const downloadPlaylist = async (playlistUrl) => {
    if (playlistUrl instanceof URL) {
        // eslint-disable-next-line no-param-reassign
        playlistUrl = playlistUrl.toString();
    }
    try {
        const playlist = await (0, ytpl_1.default)(playlistUrl);
        // eslint-disable-next-line no-unreachable-loop
        for (const item of playlist.items) {
            const outputPath = `./downloads/${sanitizeFileName(item.title)}.mp3`;
            console.log(`Descargando ${item.title}...`);
            await downloadAndConvertToMp3(
            // Item has bad typings
            item.shortUrl, outputPath);
            break;
        }
        console.log('Todas las canciones se han descargado y convertido a MP3');
    }
    catch (error) {
        console.error('Error al descargar la playlist:', error);
    }
};
const playlistUrl = 'https://youtube.com/playlist?list=PLJL8ntgfl5PZr5g-AgcO6PfoKF3DSCTAy&si=JbR6n2q34_nzCLZL';
if (!fs_1.default.existsSync('./downloads')) {
    fs_1.default.mkdirSync('./downloads');
}
downloadPlaylist(playlistUrl);
