import { EmbedBuilder } from 'discord.js';

export interface EmbedPlaylist {
  action: string;
  avatarUrl: string | null;
  title: string;
  url: string;
  username: string;
}

export default {
  build: ({ title, url, action, avatarUrl, username }: EmbedPlaylist) =>
    new EmbedBuilder()
      .setColor(0xfa_a6_1a)
      .setTitle(title)
      .setURL(url)
      .setAuthor({
        name: action,
      })
      .setFooter({
        iconURL: avatarUrl || undefined,
        text: `Añadido por ${username}`,
      }),
};
