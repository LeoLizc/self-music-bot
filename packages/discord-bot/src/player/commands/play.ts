import { SlashCommandBuilder } from '../../core';
import { type CommandInteractionOptionResolver } from 'discord.js';

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
  const songName = resolver.getString('cancion');

  await interaction.reply(`Reproduciendo ${songName}`);
});

export const playCommand = builder;
