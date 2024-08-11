import { type RESTPostAPIChatInputApplicationCommandsJSONBody, type CommandInteraction } from 'discord.js';

export type SlashCommandAction = (
  interaction: CommandInteraction,
) => Promise<void> | void;

export interface CommandJsonResolvable {
  name: string;
  toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
  action: SlashCommandAction;
}