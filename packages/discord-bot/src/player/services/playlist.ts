import { shuffle } from '../../utils/array';
import songBuilder from '../ux/song';
import {
  type AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
} from '@discordjs/voice';
import { type VoiceBasedChannel } from 'discord.js';
import { pldl } from 'pldl';

interface Embed {
  avatarUrl: string | null;
  username: string;
}

interface Song {
  duration: string | null;
  embed: Embed;
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
}

interface AddSongParameters {
  embed: Embed;
  insertFirst?: boolean;
  url: string;
}

interface AddPlaylistParameters {
  embed: Embed;
  url: string;
}

export class PlaylistManager {
  guildId: string;
  player: AudioPlayer;
  songs: Song[];
  channel: VoiceBasedChannel;

  constructor(
    guildId: string,
    player: AudioPlayer,
    channel: VoiceBasedChannel,
  ) {
    this.guildId = guildId;
    this.player = player;
    this.songs = [];
    this.channel = channel;

    player.on('stateChange', async (_, newState) => {
      if (
        newState.status === AudioPlayerStatus.Idle &&
        player.playable.length !== 0
      ) {
        if (this.songs.length) {
          const { embed, title, url, thumbnailUrl } = this.songs[0];
          const { avatarUrl, username } = embed;

          const embedInfo = songBuilder.build({
            action: 'Reproduciendo canción',
            avatarUrl,
            songThumbnail: thumbnailUrl,
            title,
            url,
            username,
          });
          this.channel.send({ embeds: [embedInfo] });
        }

        await this.playNext();
      }
    });
    
    player.on('error', console.error);
  }

  shuffle() {
    this.songs = shuffle(this.songs);
  }

  async addSong({ embed, url, insertFirst }: AddSongParameters) {
    const video = await pldl.service.getVideo(url);

    if (video.title === '[Deleted video]') {
      throw new Error("Video unavailable");
    }

    const song = { ...video, embed };

    if (insertFirst) {
      this.songs.unshift(song);
    } else {
      this.songs.push(song);
    }

    this.checkAndPlay().catch(console.error);
    return song;
  }

  async addPlaylist({ embed, url }: AddPlaylistParameters) {
    const playlist = await pldl(url);

    for (const video of playlist.videos) {
      if (video.title === '[Deleted video]') continue;
      this.songs.push({
        ...video,
        embed,
      });
    }
    
    const playlistOriginal = playlist;
    playlistOriginal.videos = Array.from(this.songs);

    this.checkAndPlay().catch(console.error);
    return playlist;
  }

  private async checkAndPlay() {
    if (this.player.state.status === AudioPlayerStatus.Idle) {
      await this.playNext();
    } else {
      console.log('No se puede reproducir', this.player.state.status);
    }
  }

  async playNext() {
    if (this.songs.length === 0) {
      return false;
    }

    const song = this.songs.shift()!;

    // eslint-disable-next-line no-console
    console.log(`Playing url: "${song.url}"`);

    const stream = await pldl.service.downloadVideoUrl(song.url, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const resource = createAudioResource(stream.stream);
    this.player.play(resource);
    return true;
  }

  async skip() {
    if (this.songs.length === 0) {
      return false;
    }

    // this.player.stop();
    return await this.playNext();
  }

  async stop() {
    this.player.stop();
    this.songs = [];
  }

  pause() {
    return this.player.pause(true);
  }

  resume() {
    return this.player.unpause();
  }

  async removeSong(index: number) {
    this.songs.splice(index, 1);
    await this.checkAndPlay();
  }
}
