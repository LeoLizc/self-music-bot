import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath);

const sanitizeFileName = (name) => {
  return name.replaceAll(/["*/:<>?\\|]/gu, '');
};

const downloadAndConvertToMp3 = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { filter: 'audioonly' });
    ffmpeg(stream)
      .audioBitrate(128)
      .toFormat('mp3')
      .save(outputPath)
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// eslint-disable-next-line no-shadow
const downloadPlaylist = async (playlistUrl) => {
  try {
    const playlist = await ytpl(playlistUrl);
    for (const item of playlist.items) {
      const outputPath = `./downloads/${sanitizeFileName(item.title)}.mp3`;

      console.log(`Descargando ${item.title}...`);
      await downloadAndConvertToMp3(item.shortUrl, outputPath);

      // break;
    }

    console.log('Todas las canciones se han descargado y convertido a MP3');
  } catch (error) {
    console.error('Error al descargar la playlist:', error);
  }
};

const playlistUrl =
  'https://youtube.com/playlist?list=PLJL8ntgfl5PZr5g-AgcO6PfoKF3DSCTAy&si=JbR6n2q34_nzCLZL';
if (!fs.existsSync('./downloads')) {
  fs.mkdirSync('./downloads');
}

downloadPlaylist(playlistUrl);
