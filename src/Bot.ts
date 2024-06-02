import { config } from 'dotenv';
import { Client, GatewayIntentBits, Events, Interaction, Message } from 'discord.js';
import ready from './utils/ready';
import { handleMessageCommand } from './utils/commands';

config();

const token = process.env.DISCORD_BOT_TOKEN;

console.log('Bot is starting...');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

ready(client, true);

client.login(token);

client.on(Events.InteractionCreate, async (i: Interaction) => {
	if (!i.isChatInputCommand()) {
		return;
	}
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
				content: `There was an error while executing this command!`,
				ephemeral: true,
			});
		}
	}
});

client.on(Events.MessageCreate, (message: Message) => {
	if (!message.content.startsWith('$') || message.content.length < 3) {
		return;
	}
	handleMessageCommand(message);
});
