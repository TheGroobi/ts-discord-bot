import { SlashCommandBuilder } from '@discordjs/builders';
import { quitCommand } from '../play';
import { Command } from 'src/types';
import { player } from '../../bot';

export default {
	data: new SlashCommandBuilder()
		.setName('quit')
		.setDescription('Removes all queue and stops the bot, disconnecting it from the channel'),
	async execute(i) {
		quitCommand(player, i);
	},
} satisfies Command['default'];
