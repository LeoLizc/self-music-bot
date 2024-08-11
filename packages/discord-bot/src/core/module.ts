import { Client } from 'discord.js';
import { CommandJsonResolvable } from './types/sCBuilder';

export class Module {
  public name: string;
  public commands: CommandJsonResolvable[];

  constructor(name: string, commands: CommandJsonResolvable[]) {
    this.name = name;
    this.commands = commands;
  }

  register(client: Client) {
    this.commands.forEach(command => {
      client.commands.set(command.name, command);
    });
  }
}
