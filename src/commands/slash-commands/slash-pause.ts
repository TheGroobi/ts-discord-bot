import { SlashCommandBuilder } from '@discordjs/builders';
import { pauseCommand } from '../play';
import { Command } from 'src/types';
import { player } from '../../bot';

export default {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription(
			'Pauses the current song if any is playing. If paused before, resumed the paused song.'
		),
	async execute(i) {
		pauseCommand(player, i);
	},
} satisfies Command['default'];
