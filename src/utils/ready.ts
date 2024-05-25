import { Client, Events } from "discord.js";
import readyCommands from "./readyCommands";

export default (c: Client): void => {
	try {
		c.once(Events.ClientReady, (readyClient) => {
			console.log(`Ready, Logged in as ${readyClient.user.username}`);
		});
		readyCommands(c);

	} catch (e: unknown) {
		console.log(e);
	}
};
