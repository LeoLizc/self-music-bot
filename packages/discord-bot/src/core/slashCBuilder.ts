import {
  type CommandJsonResolvable,
  type SlashCommandAction,
} from './types/sCBuilder';
import {
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder as SCB,
} from 'discord.js';

export class SlashCommandBuilder extends SCB implements CommandJsonResolvable {
  action: SlashCommandAction;

  constructor() {
    super();

    this.action = () => {};
  }

  setAction(action: SlashCommandAction): this {
    this.action = action;
    return this;
  }

  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    const { action: _, ...rest } = this;

    return super.toJSON.call(rest);
  }
}
