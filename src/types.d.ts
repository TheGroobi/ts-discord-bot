import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

interface Command {
	default: {
		data: SlashCommandBuilder;
		execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	};
}
