import { PlaylistManager } from './playlist';
import {
  createAudioPlayer,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { type VoiceBasedChannel } from 'discord.js';

export class PlaylistAdministratorService {
  map = new Map<string, PlaylistManager>();

  create(channel: VoiceBasedChannel) {
    const guildId = channel.guild.id;
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
      },
    });
    let connection = getVoiceConnection(guildId);

    if (!connection) {
      connection = joinVoiceChannel({
        adapterCreator: channel.guild.voiceAdapterCreator,
        channelId: channel.id,
        guildId,
      });
    }

    this.map.set(guildId, new PlaylistManager(guildId, player));
    connection.subscribe(player);

    return this.map.get(guildId);
  }

  get(channel: VoiceBasedChannel, createIfNotExists = true) {
    const guildId = channel.guild.id;
    if (!this.map.has(guildId) && createIfNotExists) {
      this.create(channel);
    }

    return this.map.get(guildId)!;
  }

  delete(guildId: string) {
    const manager = this.map.get(guildId);

    if (manager) {
      manager.stop();
    }

    this.map.delete(guildId);

    const connection = getVoiceConnection(guildId);
    connection?.disconnect();
    connection?.destroy();
  }
}

export const playlistAdministrator = new PlaylistAdministratorService();
