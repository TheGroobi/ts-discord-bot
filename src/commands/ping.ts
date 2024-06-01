import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "src/types";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(i: CommandInteraction) {
		await i.reply(`Pong!`);
	},
} satisfies Command["default"];
