import { shuffle } from '../../utils/array';
import {
  type AudioPlayer,
  AudioPlayerStatus,
  createAudioResource,
} from '@discordjs/voice';
import { pldl } from 'pldl';

export class PlaylistManager {
  guildId: string;
  player: AudioPlayer;
  songs: string[];

  constructor(guildId: string, player: AudioPlayer) {
    this.guildId = guildId;
    this.player = player;
    this.songs = [];

    player.on('stateChange', async (_, newState) => {
      if (newState.status === AudioPlayerStatus.Idle) {
        await this.playNext();
      }
    });
  }

  shuffle() {
    this.songs = shuffle(this.songs);
  }

  async addSong(song: string) {
    this.songs.push(song);
    await this.checkAndPlay();
  }

  private async checkAndPlay() {
    if (this.player.state.status === AudioPlayerStatus.Idle) {
      await this.playNext();
    }
  }

  async playNext() {
    if (this.songs.length === 0) {
      return;
    }

    const song = this.songs.shift()!;

    console.log(`Playing url: "${song}"`);

    const stream = await pldl.service.downloadVideoUrl(song, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const resource = createAudioResource(stream.stream);
    this.player.play(resource);
  }

  async skip() {
    this.player.stop();
    await this.playNext();
  }

  async stop() {
    this.player.stop();
    this.songs = [];
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.unpause();
  }

  async removeSong(index: number) {
    this.songs.splice(index, 1);
    await this.checkAndPlay();
  }
}
