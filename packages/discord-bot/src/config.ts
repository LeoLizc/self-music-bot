import { GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildVoiceStates,
];

export const CONFIG = {
  clientId: process.env.DISCORD_BOT_CLIENT_ID || '',
  intents,
  token: process.env.DISCORD_BOT_TOKEN || '',
};
