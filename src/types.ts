import type {
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	Client,
	Collection,
} from 'discord.js';

export interface Command {
	default: {
		data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
		execute: (interaction: CommandInteraction) => Promise<void>;
	};
}

export type ClientWithCommands = Client & { commands?: Collection<string, Command['default']> };

export type CommandInteractionWithClientCommands = Omit<CommandInteraction, 'client'> & {
	client: ClientWithCommands;
};
