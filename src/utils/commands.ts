import fs from 'node:fs';
import path from 'node:path';
import { CommandInteraction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { Client, Collection } from 'discord.js';
import { Command } from 'src/types';
import { config } from 'dotenv';
import { Message } from 'discord.js';
import { isValidURL, loadModule } from './helper';

config();
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const publicKey = process.env.DISCORD_PUBLIC_KEY;
let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

export const readySlashCommands = (c: Client): boolean | void => {
	c.commands = new Collection();
	const foldersPath = path.join(__dirname, '../commands');
	const commandFiles = fs.readdirSync(foldersPath);
	let failed = 0;

	for (const f of commandFiles) {
		const filePath = path.join(foldersPath, f);
		const command = loadModule<Command>(filePath).default;

		// Add new item to the commands Collection
		if (command.data.name && command.data && 'execute' in command) {
			c.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${f} is missing a required "data" or "execute" property`);
			failed++;
		}
	}
	console.log(`Successfully loaded ${commandFiles.length - failed} commands!`);
	return true;
};

export const deploySlashCommands = async (): Promise<void> => {
	console.log(commands);
	if (!token || !clientId || !publicKey) {
		throw new Error('one of the env variables is not defined');
	}
	const rest = new REST().setToken(token);
	try {
		console.log(`Started refreshing, ${commands.length} application (/) commmands`);

		const data = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});

		console.log(`Successfully reloaded ${(data as unknown[]).length} application application (/) commmands`);
	} catch (e: unknown) {
		console.error(e);
	}
};

export function handleMessageCommand(message: Message) {
	const fullCommand = message.content.split('$').slice(1).join().split(' ');
	const command = fullCommand[0];
	const args = fullCommand.slice(1);

	if (command === 'ping') {
		message.channel.send('Pong!');
	}

	if (command === 'play' && args[0]) {
		playCommand(args[0], message);
	}
}

export async function playCommand(url: string, i: Message | CommandInteraction): Promise<void> {
	if (!isValidURL(url)) {
		if (i instanceof Message) {
			i.channel.send('The URL provided is not a valid song link, please try with a valid URL.');
			return;
		} else {
			await i.reply('The URL provided is not a valid song link, please try with a valid URL.');
		}
	}

	console.log('Procceeding the play command...');
}
