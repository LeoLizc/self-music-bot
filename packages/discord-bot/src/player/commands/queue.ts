import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator as pa } from '../services/administrator';
import queueEmbedBuilder from '../ux/queue';
import { type GuildMember } from 'discord.js';

const builder = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Muestra la lista de canciones en cola');

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

  const queue = playlist.songs;

  const embedInfo = queueEmbedBuilder.build({ queue });
  await interaction.reply({ embeds: [embedInfo] });
});

export const queueCommand = builder;
