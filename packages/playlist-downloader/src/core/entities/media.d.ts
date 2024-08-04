import { type Stream } from 'stream';

export interface Video {
  duration: string | null;
  id: string;
  title: string;
  url: string;
}

export interface StreamMedia {
  id: string;
  stream: Stream;
  title: string;
  url: string;
}
