import { Client, Events } from "discord.js";
import { readyCommands, deployCommands } from "./load-commands";

export default (c: Client, deploy: boolean = false): void => {
	try {
		c.once(Events.ClientReady, (readyClient) => {
			console.log(`Ready, Logged in as ${readyClient.user.username}`);
		});
		readyCommands(c);
		if (deploy) {
			deployCommands();
		}
	} catch (e: unknown) {
		console.log(e);
	}
};
