import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator as pa } from '../services/administrator';
import { type GuildMember } from 'discord.js';

const builder = new SlashCommandBuilder()
  .setName('next')
  .setDescription('Reproduce la siguiente canción');

builder.setAction(async (interaction) => {
  const channel = (interaction.member as GuildMember)?.voice.channel;

  if (!channel) {
    await interaction.reply('Debes estar en un canal de voz');
    return;
  }

  const playlist = pa.get(channel);

  if (!playlist) {
    await interaction.reply('No hay canciones en la lista');
    return;
  }

  if (await playlist.skip()) {
    await interaction.reply('Reproduciendo siguiente canción');
  } else {
    await interaction.reply('No hay más canciones en la lista');
  }
});

export const nextCommand = builder;