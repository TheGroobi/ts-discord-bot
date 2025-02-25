import { CommandInteraction } from 'discord.js';
import { CommandInteractionWithClientCommands } from 'src/types';

export async function handleSlashCommand(i: CommandInteractionWithClientCommands) {
	const command = i.client.commands?.get(i.commandName);

	if (!command) {
		console.error(`No command matching ${i.commandName} was found.`);
		return;
	}

	try {
		await command.execute(i as CommandInteraction);
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
}
