import { Module } from '../core';
import { disconnectCommand } from './commands/disconnect';
import { nextCommand } from './commands/next';
import { pauseCommand } from './commands/pause';
import { playCommand } from './commands/play';
import { playlistCommand } from './commands/playlist';
import { queueCommand } from './commands/queue';
import { resumeCommand } from './commands/resume';
import { shuffleCommand } from './commands/shuffle';

export const playerModule = new Module('reproductor', [
  playCommand,
  disconnectCommand,
  nextCommand,
  playlistCommand,
  shuffleCommand,
  pauseCommand,
  resumeCommand,
  queueCommand,
]);
