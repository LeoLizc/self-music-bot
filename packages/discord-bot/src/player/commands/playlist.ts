import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator } from '../services/administrator';
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
    .setDescription('Url de la playlist')
    .setRequired(true),
);

builder.setAction(async (interaction) => {
  const resolver = interaction.options as CommandInteractionOptionResolver;
  const plName = resolver.getString('playlist')!;

  await interaction.reply(`Reproduciendo ${plName}`);
  const channel = (interaction.member as GuildMember)?.voice.channel;

  if (!channel) {
    await interaction.followUp('Debes estar en un canal de voz');
    return;
  }

  try {
    const playlist = playlistAdministrator.get(channel, true);
    await playlist.addPlaylist(plName);
  } catch (error) {
    console.error(error);
    await interaction.followUp('Ocurrió un error');
  }
});

export const playlistCommand = builder;
