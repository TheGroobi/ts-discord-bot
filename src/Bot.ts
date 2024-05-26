import { config } from "dotenv";
import { Client, GatewayIntentBits, Events, Interaction } from "discord.js";
import ready from "./utils/ready";

config();

const token = process.env.DISCORD_BOT_TOKEN;

console.log("Bot is starting...");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

//second argument set to true for deploying the commands to discord
// REMOVE AFTER DEV
ready(client);

client.login(token);

client.on(Events.InteractionCreate, async (i: Interaction) => {
	if (!i.isChatInputCommand()) return;

	const command = i.client.commands.get(i.commandName);
	if (!command) {
		console.error(`No command matching ${i.commandName} was found.`);
		return;
	}

	try {
		await command.execute(i);
	} catch (e: unknown) {
		console.error(e);
		if (i.replied || i.deferred) {
			await i.followUp({
				content: `There was an error while executing ${i.commandName}`,
				ephemeral: true,
			});
		} else {
			await i.reply({
				content: `there was an error while executing this command!`,
				ephemeral: true,
			});
		}
	}
});

// client.on(Events.MessageCreate, (message: Message) => {
// 	// Log every message received
// 	console.log(`Message received: ${message.content}`);

// 	// Check if the message is "!ping"
// 	if (message.content === "!ping") {
// 		// Respond with "Pong!"
// 		message.channel.send("Pong!");
// 	}
// });
