import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator as pa } from '../services/administrator';
import { type GuildMember } from 'discord.js';

const builder = new SlashCommandBuilder()
  .setName('resume')
  .setDescription('reanuda la lista de reproducción');

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

  await interaction.deferReply();

  if (playlist.resume()) {
    await interaction.editReply('Lista de reproducción reanudada');
  } else {
    await interaction.editReply('No se pudo reanudar la lista de reproducción');
  }
});

export const resumeCommand = builder;
