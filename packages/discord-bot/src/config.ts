import { config } from 'dotenv';

config();

export const CONFIG = {
  clientId: process.env.DISCORD_BOT_CLIENT_ID || '',
  token: process.env.DISCORD_BOT_TOKEN || '',
};
