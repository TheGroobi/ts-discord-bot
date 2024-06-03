import { Message } from 'discord.js';
import { playCommand } from '../../commands/play';

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
