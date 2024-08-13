import { type Readable } from 'stream';

export interface Video {
  duration: string | null;
  id: string;
  title: string;
  url: string;
}

export interface StreamMedia {
  id: string;
  stream: Readable;
  title: string;
  url: string;
}
