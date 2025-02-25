import { Events } from 'discord.js';

import { readySlashCommands, deploySlashCommands } from './slash-commands';
import { ClientWithCommands } from 'src/types';

export default (c: ClientWithCommands, deploy: boolean = false): void => {
	try {
		c.once(Events.ClientReady, readyClient => {
			console.log(`Ready, Logged in as ${readyClient.user.username}`);
		});
		readySlashCommands(c);
		if (deploy) {
			deploySlashCommands();
		}
	} catch (e: unknown) {
		console.log(e);
	}
};
