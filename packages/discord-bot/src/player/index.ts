import { Module } from '../core';
import { disconnectCommand } from './commands/disconnect';
import { nextCommand } from './commands/next';
import { playCommand } from './commands/play';

export const playerModule = new Module('reproductor', [
  playCommand,
  disconnectCommand,
  nextCommand,
]);
