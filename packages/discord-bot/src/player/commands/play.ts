import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator } from '../services/administrator';
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
    .setDescription('Nombre de la canción')
    .setRequired(true),
);

builder.setAction(async (interaction) => {
  const resolver = interaction.options as CommandInteractionOptionResolver;
  const songName = resolver.getString('cancion')!;

  await interaction.reply(`Reproduciendo ${songName}`);
  const channel = (interaction.member as GuildMember)?.voice.channel;

  if (!channel) {
    await interaction.followUp('Debes estar en un canal de voz');
    return;
  }

  try {
    const playlist = playlistAdministrator.get(channel, true);
    await playlist.addSong(songName);
  } catch (error) {
    console.error(error);
    await interaction.followUp('Ocurrió un error');
  }
});

export const playCommand = builder;
