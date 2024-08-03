export interface PlaylistOptions {
  countryCode?: string;
  lang?: string;
  limit?: number;
  utcOffsetMinutes?: number;
}

export interface VideoOptions {
  filter?:
    | 'audioandvideo'
    | 'videoandaudio'
    | 'video'
    | 'videoonly'
    | 'audio'
    | 'audioonly';

  format?: videoFormat;

  quality?:
    | 'lowest'
    | 'highest'
    | 'highestaudio'
    | 'lowestaudio'
    | 'highestvideo'
    | 'lowestvideo'
    | string
    | number
    | string[]
    | number[];

  range?: {
    end?: number;
    start?: number;
  };
}

interface videoFormat {
  approxDurationMs?: string;
  audioChannels?: number;
  audioQuality?: 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM';
  averageBitrate?: number;
  bitrate?: number;
  colorInfo?: {
    matrixCoefficients: string;
    primaries: string;
    transferCharacteristics: string;
  };
  container: 'flv' | '3gp' | 'mp4' | 'webm' | 'ts';
  contentLength: string;
  fps?: number;
  hasAudio: boolean;
  hasVideo: boolean;
  height?: number;
  indexRange?: { end: string; start: string };
  initRange?: { end: string; start: string };
  isLive: boolean;
  lastModified: string;

  maxDvrDurationSec?: number;
  mimeType?: string;
  projectionType?: 'RECTANGULAR';
  quality:
    | 'tiny'
    | 'small'
    | 'medium'
    | 'large'
    | 'hd720'
    | 'hd1080'
    | 'hd1440'
    | 'hd2160'
    | 'highres'
    | string;
  qualityLabel:
    | '144p'
    | '144p 15fps'
    | '144p60 HDR'
    | '240p'
    | '240p60 HDR'
    | '270p'
    | '360p'
    | '360p60 HDR'
    | '480p'
    | '480p60 HDR'
    | '720p'
    | '720p60'
    | '720p60 HDR'
    | '1080p'
    | '1080p60'
    | '1080p60 HDR'
    | '1440p'
    | '1440p60'
    | '1440p60 HDR'
    | '2160p'
    | '2160p60'
    | '2160p60 HDR'
    | '4320p'
    | '4320p60';
  targetDurationSec?: number;

  url: string;
  width?: number;
}
