import { SlashCommandBuilder } from "../../core";
import { playlistAdministrator as pa } from "../services/administrator";
import songBuilder from "../ux/song";
import { type GuildMember } from "discord.js";

const builder = new SlashCommandBuilder()
  .setName("next")
  .setDescription("Reproduce la siguiente canción");

builder.setAction(async (interaction) => {
  const channel = (interaction.member as GuildMember)?.voice.channel;

  if (!channel) {
    await interaction.reply("Debes estar en un canal de voz");
    return;
  }

  const playlist = pa.get(channel);

  if (!playlist) {
    await interaction.reply("No hay canciones en la lista");
    return;
  }

  await interaction.deferReply({ ephemeral: true });
  if (playlist.songs.length) {
    const { embed, title, url, thumbnailUrl } = playlist.songs[0];
    const { avatarUrl, username } = embed;

    const embedInfo = songBuilder.build({
      action: "Reproduciendo canción",
      avatarUrl,
      songThumbnail: thumbnailUrl,
      title,
      url,
      username,
    });
    await interaction.editReply({ embeds: [embedInfo] });
  } else {
    await interaction.reply("No hay más canciones en la lista");
  }
});

export const nextCommand = builder;
