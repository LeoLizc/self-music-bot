import { SlashCommandBuilder } from '../../core';
import { playlistAdministrator } from '../services/administrator';

const builder = new SlashCommandBuilder()
  .setName('disconnect')
  .setDescription('Sale del canal de voz');

builder.setAction(async (interaction) => {
  const guildId = interaction.guildId!;

  playlistAdministrator.delete(guildId);
});

export const disconnectCommand = builder;
