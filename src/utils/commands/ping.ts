import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../types";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(i) {
		await i.reply(`Pong!`);
	},
} satisfies Command;