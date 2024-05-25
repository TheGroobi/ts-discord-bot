import { Client, Collection, Events } from "discord.js";

export default (c: Client): void => {
	try {
		c.once(Events.ClientReady, (readyClient) => {
			console.log(`Ready, Logged in as ${readyClient.user.username}`);
		});
		c.commands = new Collection();
	} catch (e: unknown) {
		console.log(e);
	}
};
