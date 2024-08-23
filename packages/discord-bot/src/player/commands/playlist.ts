import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator } from '../services/administrator';
import playlistBuilder from '../ux/playlist';
import songBuilder from '../ux/song';
import { AudioPlayerStatus } from '@discordjs/voice';
import {
  type CommandInteractionOptionResolver,
  type GuildMember,
} from 'discord.js';

const builder = new SlashCommandBuilder()
  .setName('playlist')
  .setDescription('Reproduce una playlist');

builder.addStringOption((option) =>
  option
    .setName('playlist')
    .setDescription('URL de la playlist')
    .setRequired(true),
);

builder.setAction(async (interaction) => {
  const resolver = interaction.options as CommandInteractionOptionResolver;
  const plName = resolver.getString('playlist')!;

  const channel = (interaction.member as GuildMember)?.voice.channel;
  if (!channel) {
    await interaction.reply('Debes estar en un canal de voz');
    return;
  }

  const playlist = playlistAdministrator.get(channel, true);
  const isPlayerIdle = playlist.player.state.status === AudioPlayerStatus.Idle;

  try {
    const embed = {
      avatarUrl: interaction.user.avatarURL(),
      songThumbnail: interaction.user.avatarURL(),
      username: interaction.user.displayName,
    };
    const playlistInfo = await playlist.addPlaylist({
      embed,
      url: plName,
    });
    const embedInfo = playlistBuilder.build({
      action: 'Playlist añadida',
      avatarUrl: embed.avatarUrl,
      title: playlistInfo.title,
      url: playlistInfo.url,
      username: embed.username,
    });

    await interaction.reply({
      embeds: [embedInfo],
    });

    if (isPlayerIdle && playlistInfo.videos.length) {
      const embedSong = songBuilder.build({
        action: 'Reproduciendo',
        avatarUrl: interaction.user.avatarURL(),
        songThumbnail: playlistInfo.videos[0].thumbnailUrl,
        title: playlistInfo.videos[0].title,
        url: playlistInfo.videos[0].url,
        username: interaction.user.displayName,
      });

      await interaction.followUp({
        embeds: [embedSong],
      });
    }
  } catch (error) {
    console.error(error instanceof Error && error.message);
    if (error instanceof Error && error.message === 'Playlist unavailable') {
      await interaction.reply('Playlist no disponible');
    } else {
      await interaction.reply('Ocurrió un error');
    }
  }
});

export const playlistCommand = builder;
