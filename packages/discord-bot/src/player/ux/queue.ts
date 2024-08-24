import { type PlaylistManager } from '../services/playlist';
import { EmbedBuilder } from 'discord.js';

type SongArray = typeof PlaylistManager.prototype.songs;

export interface EmbedQueueOptions {
  queue: SongArray;
}

export default {
  build: ({ queue }: EmbedQueueOptions) => {
    let totalDuration = 0;

    for (const song of queue) {
      if (song.duration) {
        const [minutes, seconds] = song.duration.split(':');
        totalDuration +=
          Number.parseInt(minutes, 10) * 60 + Number.parseInt(seconds, 10);
      }
    }

    const time: string = new Date(totalDuration * 1_000)
      .toISOString()
      .slice(11, 19);

    const songsString = queue
      .map(
        (song, index) =>
          `\`${index + 1}.\` **[${song.title}](${song.url})**\n(${song.duration || 'Desconocido'})`,
      )
      .join('\n');

    const description = `**${queue.length} canciones en espera**\n(${time})\n${songsString}`;

    return new EmbedBuilder()
      .setColor(0xfa_a6_1a)
      .setTitle('🎶Lista de reproducción🎶')
      .setDescription(description);
  },
};
