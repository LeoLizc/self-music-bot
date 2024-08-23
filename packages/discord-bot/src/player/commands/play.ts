import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator } from '../services/administrator';
import songBuilder from '../ux/song';
import { AudioPlayerStatus } from '@discordjs/voice';
import {
  type CommandInteractionOptionResolver,
  type GuildMember,
} from 'discord.js';

const builder = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Reproduce una canción');

builder.addStringOption((option) =>
  option
    .setName('cancion')
    .setDescription('URL de la canción')
    .setRequired(true),
);

builder.addBooleanOption((option) =>
  option
    .setName('top')
    .setDescription('Añadir como primera canción en la cola')
    .setRequired(false),
);

builder.setAction(async (interaction) => {
  const resolver = interaction.options as CommandInteractionOptionResolver;
  const songName = resolver.getString('cancion')!;
  const insertFirst = resolver.getBoolean('top') || false;

  const channel = (interaction.member as GuildMember)?.voice.channel;
  if (!channel) {
    await interaction.reply('Debes estar en un canal de voz');
    return;
  }

  const playlist = playlistAdministrator.get(channel, true);
  const isPlayerIdle = playlist.player.state.status === AudioPlayerStatus.Idle;

  try {
    const action = isPlayerIdle ? 'Reproduciendo' : 'Añadida';
    const embed = {
      avatarUrl: interaction.user.avatarURL(),
      username: interaction.user.displayName,
    };
    const song = await playlist.addSong({
      embed,
      insertFirst,
      url: songName,
    });
    const embedInfo = songBuilder.build({
      action,
      avatarUrl: embed.avatarUrl,
      songThumbnail: song.thumbnailUrl,
      title: song.title,
      url: song.url,
      username: embed.username,
    });

    await interaction.reply({
      embeds: [embedInfo],
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === 'Video unavailable') {
      await interaction.reply('Video no disponible');
    } else {
      await interaction.reply('Ocurrió un error');
    }
  }
});

export const playCommand = builder;
