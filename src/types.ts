import type { CommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface Command {
	default: {
		data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
		execute: (interaction: CommandInteraction) => Promise<void>;
	};
}