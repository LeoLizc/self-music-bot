import { PlaylistManager } from './playlist';
import {
  createAudioPlayer,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnectionStatus,
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

    const manager = new PlaylistManager(guildId, player, channel);
    this.map.set(guildId, manager);
    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
      } catch {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        manager.stop();
        connection.destroy();
        this.map.delete(guildId);
      }
    });
  }

  get(channel: VoiceBasedChannel): PlaylistManager | undefined;
  get(channel: VoiceBasedChannel, createIfNotExists: true): PlaylistManager;
  get(
    channel: VoiceBasedChannel,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    createIfNotExists: false,
  ): PlaylistManager | undefined;
  get(channel: VoiceBasedChannel, createIfNotExists = false) {
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
