import { type ClientOptions } from 'discord.js';
import { Module } from '../module';

export interface DiscFactoryOptions extends ClientOptions {
  modules?: Module[];
}
