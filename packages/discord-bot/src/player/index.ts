import { Module } from '../core';
import { playCommand } from './commands/play';

export const playerModule = new Module('reproductor', [playCommand]);
