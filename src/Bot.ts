import { config } from 'dotenv';
import { Client, GatewayIntentBits, Events, Interaction, Message } from 'discord.js';
import type { ClientWithCommands } from './types';
import ready from './utils/ready';
import { handleMessageCommand } from './utils/handlers/message-handler';
import { handleSlashCommand } from './utils/handlers/handle-slash-command';
import { NoSubscriberBehavior, createAudioPlayer } from '@discordjs/voice';

config();

const token = process.env.DISCORD_BOT_TOKEN;

console.log('Bot is starting...');

export const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
	],
}) as ClientWithCommands;

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

