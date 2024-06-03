import { config } from 'dotenv';
import { Client, GatewayIntentBits, Events, Interaction, Message } from 'discord.js';
import ready from './utils/ready';
import { handleMessageCommand } from './utils/handlers/message-handler';
import { handleSlashCommand } from './utils/handlers/handle-slash-command';

config();

const token = process.env.DISCORD_BOT_TOKEN;

console.log('Bot is starting...');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
});

ready(client, true);

client.login(token);

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	handleSlashCommand(interaction);
});

client.on(Events.MessageCreate, (message: Message) => {
	if (!message.content.startsWith('$') || message.content.length < 3) {
		return;
	}

	handleMessageCommand(message);
});
