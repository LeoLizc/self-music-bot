import { Module } from './module';
import { type DiscFactoryOptions } from './types/discFactory';
import { Client, REST, Routes, Collection } from 'discord.js';

export const DiscFactory = {
  create(options: DiscFactoryOptions): Client {
    const {
      modules = [],
      ...clientOptions
    } = options;
    const client = new Client(clientOptions);
    client.commands = new Collection();

    this.registerModules(client, modules);
    this.listenCommands(client);
    
    return client;
  },

  registerModules(client: Client, modules: Module[]) {
    modules.forEach(module => {
      module.register(client);
    });
  },

  listenCommands(client: Client) {
    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;
      
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      
      try {
        console.info(`Command ${command.name} executed by ${interaction.user.tag}`);
        await command.action(interaction);
        
        if (interaction.replied) return;
        await interaction.reply({ content: 'Command executed!', ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    });
  },

  updateAppCommands(client: Client, auth: {token: string, clientId: string}) {
    if(!client.commands) return;
    const {token, clientId} = auth;

    if(token == null || token === '') return;
    if(clientId == null || clientId === '') return;

    const restClient = new REST().setToken(token);
    const commands = client.commands.map((command) => {
      return command.toJSON()
    })
    
    restClient.put(
      Routes.applicationCommands(clientId),
      {
        body: commands,
      },
    );
  },
};
