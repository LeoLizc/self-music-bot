import { client } from '.';
import { CONFIG } from './config';
import { DiscFactory } from './core';

DiscFactory.updateAppCommands(client, {
  clientId: CONFIG.clientId,
  token: CONFIG.token,
});
