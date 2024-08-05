#!/usr/bin/env node

import pldl from '.';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import prompts from 'prompts';

(async () => {
  const response = await prompts(
    [
      {
        message: 'Enter the URL of the playlist',
        name: 'url',
        type: 'text',

        // eslint-disable-next-line @typescript-eslint/no-shadow
        validate: (url) => {
          if (!url) {
            return 'URL is required';
          }

          if (!pldl.validatePlaylistUrl(url)) {
            return 'Invalid URL';
          }

          return true;
        },
      },
      {
        active: 'Yes',
        inactive: 'No',
        message: 'Do you want to limit the number of videos to download?',
        name: 'limit',
        type: 'toggle',
      },
      {
        message: 'Enter the number of videos to download',
        name: 'limit',
        type: (previous) => (previous ? 'number' : null),
        validate: (limitValue) => {
          if (limitValue <= 0) {
            return 'Limit must be greater than 0';
          }

          return true;
        },
      },
      {
        choices: [
          { title: 'Audio and Video', value: 'audioandvideo' },
          { title: 'Video and Audio', value: 'videoandaudio' },
          { title: 'Video Only', value: 'videoonly' },
          { title: 'Audio Only', value: 'audioonly' },
        ],
        message: 'Choose an audio/video filter',
        name: 'filter',
        type: 'select',
      },
      {
        active: 'Yes',
        inactive: 'No',
        message: 'Do you want any specific audio format? (Default: mp3)',
        name: 'audioFormat',
        type: (previous) => (previous === 'audioonly' ? 'toggle' : null),
      },
      {
        choices: [
          { title: 'mp3', value: 'mp3' },
          { title: 'm4a', value: 'm4a' },
          { title: 'opus', value: 'opus' },
          { title: 'vorbis', value: 'vorbis' },
          { title: 'wav', value: 'wav' },
          { title: 'flac', value: 'flac' },
          { title: 'aac', value: 'aac' },
          { title: 'webm', value: 'webm' },
          { title: 'any', value: undefined },
        ],
        hint: '(Default: mp3)',
        message: 'Choose the audio format',
        name: 'audioFormat',
        type: (previous, values) =>
          values.filter === 'audioonly' && previous ? 'select' : null,
      },
      {
        choices: [
          { title: 'Lowest', value: 'lowest' },
          { title: 'Highest', value: 'highest' },
          { title: 'Highest Audio', value: 'highestaudio' },
          { title: 'Lowest Audio', value: 'lowestaudio' },
          { title: 'Highest Video', value: 'highestvideo' },
          { title: 'Lowest Video', value: 'lowestvideo' },
          { title: 'any', value: null },
        ],
        message: 'choose the quality of the video',
        name: 'quality',
        type: 'select',
      },
      {
        active: 'Yes',
        inactive: 'No',
        message:
          'Do you want to change the output directory? (Default: ./music)',
        name: 'outputDir',
        type: 'toggle',
      },
      {
        message: 'Enter the output directory',
        name: 'outputDir',
        type: (previous) => (previous ? 'text' : null),
        // eslint-disable-next-line unicorn/prevent-abbreviations
        validate: (outDir) => {
          if (!outDir) {
            return 'Output directory is required';
          }

          return true;
        },
      },
    ],
    {
      onCancel: () => {
        process.exit(0);
      },
    },
  );

  const url = response.url;
  const result = {
    format:
      response.audioFormat || (response.filter === 'audioonly' ? 'mp3' : 'mp4'),

    outputDir: response.outputDir || './music',

    playlistOptions: {
      limit: response.limit || undefined,
    },

    videoOptions: {
      filter: response.filter || 'audioandvideo',
      quality: response.quality || undefined,
    },
  };

  const playlist = await pldl(url, {
    playlistOptions: result.playlistOptions,
    videoOptions: result.videoOptions,
  });

  const { confirmation } = await prompts({
    active: 'Yes',
    inactive: 'No',
    message: `Do you want to download ${playlist.title}?`,
    name: 'confirmation',
    type: 'toggle',
  });

  if (!confirmation) {
    console.log('Download canceled');
    process.exit(0);
  }

  if (!fs.existsSync(result.outputDir)) {
    const { createDir } = await prompts({
      active: 'Yes',
      inactive: 'No',
      message: `Directory ${result.outputDir} does not exist. Do you want to create it?`,
      name: 'createDir',
      type: 'toggle',
    });

    if (createDir) {
      fs.mkdirSync(result.outputDir);
    } else {
      console.log('Download canceled');
      process.exit(0);
    }
  }

  const videos = await playlist.getFormattedVideos();

  // group videos in groups of 4
  // eslint-disable-next-line unicorn/no-array-reduce
  const videoGroups = videos.reduce<Array<typeof videos>>(
    (accumulator, video, index) => {
      const groupIndex = Math.floor(index / 4);

      if (!accumulator[groupIndex]) {
        accumulator[groupIndex] = [];
      }

      accumulator[groupIndex].push(video);

      return accumulator;
    },
    [],
  );

  ffmpeg.setFfmpegPath(ffmpegPath!);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors: any[] = [];

  for (const group of videoGroups) {
    await Promise.allSettled(
      group.map(async (video) => {
        const stream = (await video.getStream()).stream;

        const outputPath = `${result.outputDir}/${video.getFormatedTitle()}.${
          result.format
        }`;

        console.log(`Downloading ${video.title}...`);

        try {
          await new Promise((resolve, reject) => {
            ffmpeg(stream)
              .audioBitrate(128)
              .toFormat(result.format)
              .save(outputPath)
              .on('end', () => {
                resolve(true);
              })
              .on('error', (error) => {
                reject(error);
              });
          });
        } catch (error) {
          console.error(`Error downloading ${video.title}:`, error);
          errors.push({ error, video });
          return;
        }

        console.log(`Downloaded ${video.title}`);
      }),
    );
  }

  console.log('Download completed');
  console.error(errors);
})();
