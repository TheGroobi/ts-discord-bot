import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { playCommand } from '../utils/commands';
import { Command } from 'src/types';

export default {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays the provided song from a YouTube, Spotify, or SoundCloud link')
		.addStringOption(opt =>
			opt.setName('url').setDescription('The URL of the song to play').setRequired(true)
		),
	async execute(i: CommandInteraction) {
		const url = i.options.get('url')?.value as string;
		if (!url) {
			await i.reply('You must provide a URL to play a song!');
			return;
		}
		playCommand(url, i);
	},
} satisfies Command['default'];
