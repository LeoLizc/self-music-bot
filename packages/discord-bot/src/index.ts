import { CONFIG } from './config';
import { DiscFactory } from './core';
import { playerModule } from './player';
import { GatewayIntentBits } from 'discord.js';

export const client = DiscFactory.create({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  modules: [playerModule],
});

DiscFactory.updateAppCommands(client, {
  clientId: CONFIG.clientId,
  token: CONFIG.token,
});

client.login(CONFIG.token);
