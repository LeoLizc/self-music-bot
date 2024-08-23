import { type Readable } from 'stream';

export interface Video {
  duration: string | null;
  id: string;
  thumbnailUrl?: string;
  title: string;
  url: string;
}

export interface StreamMedia {
  id: string;
  stream: Readable;
  thumbnailUrl?: string;
  title: string;
  url: string;
}
