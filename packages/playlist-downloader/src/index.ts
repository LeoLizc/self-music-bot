/* eslint-disable canonical/filename-match-exported */
import {
  type PlaylistOptions,
  type VideoOptions,
} from './core/entities/options';
import { InvidiousService } from './infrastructure/service/invidious';
import { PlayList } from './interface/playlist';

const service = new InvidiousService();

interface PldlOptionsType {
  playlistOptions?: PlaylistOptions;
  videoOptions?: VideoOptions;
}

type PldlTypeFunctionType = (
  url: string,
  options?: PldlOptionsType,
) => Promise<PlayList>;

interface PldlType extends PldlTypeFunctionType {
  service: InvidiousService;
  validatePlaylistUrl: (url: string) => boolean;
  validateVideoUrl: (url: string) => boolean;
}

export const pldl: PldlType = async (
  url: string,
  options?: PldlOptionsType,
) => {
  const playlist = await service.getPlaylist(url, options?.playlistOptions);
  return new PlayList(playlist, service, options?.videoOptions);
};

pldl.service = service;
pldl.validatePlaylistUrl = service.validatePlaylistUrl;
pldl.validateVideoUrl = service.validateVideoUrl;

export default pldl;
export { PlayList } from './interface/playlist';
export { Video } from './interface/video';
