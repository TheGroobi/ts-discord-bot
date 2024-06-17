import { SlashCommandBuilder } from '@discordjs/builders';
import { quitCommand } from '../play';
import { Command } from 'src/types';
import { player } from '../../bot';

export default {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the current song completely'),
	async execute(i) {
		quitCommand(player, i);
	},
} satisfies Command['default'];
