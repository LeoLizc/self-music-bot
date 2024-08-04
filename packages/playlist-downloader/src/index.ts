import { type VideoOptions } from './core/entities/options';
import { YoutubeService } from './infrastructure/service/youtube';
import { PlayList } from './interface/playlist';

const service = new YoutubeService();

export const pldl = async (url: string, options?: VideoOptions) => {
  const playlist = await service.getPlaylist(url);
  return new PlayList(playlist, service, options);
};

pldl.service = service;

export { PlayList } from './interface/playlist';
export { Video } from './interface/video';
