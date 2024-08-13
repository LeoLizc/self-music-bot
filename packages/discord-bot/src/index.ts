import { CONFIG } from './config';
import { DiscFactory } from './core';
import { playerModule } from './player';

export const client = DiscFactory.create({
  intents: CONFIG.intents,
  modules: [playerModule],
});

client
  .login(CONFIG.token)
  .then(() => {
    console.log('Logged in!');
  })
  .catch(console.error);
