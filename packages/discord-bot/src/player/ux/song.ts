import { EmbedBuilder } from 'discord.js';

interface Options {
  action: string;
  avatarUrl: string | null;
  songThumbnail?: string | null;
  title: string;
  url: string;
  username: string;
}

export default {
  build: ({
    title,
    url,
    action,
    songThumbnail,
    avatarUrl,
    username,
  }: Options) =>
    new EmbedBuilder()
      .setColor(0x00_99_ff)
      .setTitle(title)
      .setURL(url)
      .setAuthor({
        name: action,
      })
      .setThumbnail(songThumbnail || null)
      .setFooter({
        iconURL: avatarUrl || undefined,
        text: `Añadido por ${username}`,
      }),
};
