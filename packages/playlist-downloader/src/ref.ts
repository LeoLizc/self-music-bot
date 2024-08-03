import ytdl from '@distube/ytdl-core';
import ytpl from '@distube/ytpl';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

ffmpeg.setFfmpegPath(ffmpegPath!);

const sanitizeFileName = (name: string) => {
  return name.replaceAll(/["*/:<>?\\|]/gu, '');
};

const downloadAndConvertToMp3 = (url: URL | string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    if (url instanceof URL) {
      url = url.toString();
    }

    const stream = ytdl(url, { filter: 'audioonly' });
    ffmpeg(stream)
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
const downloadPlaylist = async (playlistUrl: URL | string) => {
  if (playlistUrl instanceof URL) {
    // eslint-disable-next-line no-param-reassign
    playlistUrl = playlistUrl.toString();
  }

  try {
    const playlist = await ytpl(playlistUrl);
    // eslint-disable-next-line no-unreachable-loop
    for (const item of playlist.items) {
      const outputPath = `./downloads/${sanitizeFileName(item.title)}.mp3`;

      console.log(`Descargando ${item.title}...`);
      await downloadAndConvertToMp3(
        // Item has bad typings
        (item as unknown as { shortUrl: string }).shortUrl,
        outputPath,
      );

      break;
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
