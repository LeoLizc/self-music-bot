import { CONFIG } from './config';
import { DiscFactory } from './core';
import { playerModule } from './player';
import { GatewayIntentBits } from 'discord.js';

export const client = DiscFactory.create({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  modules: [playerModule],
});

client
  .login(CONFIG.token)
  .then(() => {
    console.log('Logged in!');
  })
  .catch(console.error);
