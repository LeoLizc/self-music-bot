import { EmbedBuilder } from 'discord.js';

export interface EmbedPlaylist {
  action: string;
  avatarUrl: string | null;
  songThumbnail: string | null;
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
  }: EmbedPlaylist) =>
    new EmbedBuilder()
      .setColor(0xfa_a6_1a)
      .setTitle(title)
      .setURL(url)
      .setAuthor({
        name: action,
      })
      .setThumbnail(songThumbnail)
      .setFooter({
        iconURL: avatarUrl || undefined,
        text: `Añadido por ${username}`,
      }),
};
