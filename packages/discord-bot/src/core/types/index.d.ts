import { type Client, type Collection } from 'discord.js';
import { CommandJsonResolvable } from './sCBuilder';

declare module "discord.js" {
  export interface Client extends Client {
      commands: Collection<unknown, CommandJsonResolvable>
  }
}