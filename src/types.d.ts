import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

interface Command {
	default: {
		data: SlashCommandBuilder;
		execute: (interaction: CommandInteraction) => Promise<void>;
	};
}
