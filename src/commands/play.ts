import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../types";
import { CommandInteraction } from "discord.js";
import { playCommand } from "../utils/commands";

const play: Command["default"] = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription(
			"Plays the provided song from a YouTube, Spotify, or SoundCloud link"
		)
		.addStringOption((opt) =>
			opt
				.setName("url")
				.setDescription("The URL of the song to play")
				.setRequired(true)
		),
	async execute(i: CommandInteraction) {
		const url = i.options.get("url")?.value as string;
		if (!url) {
			await i.reply("You must provide a URL to play a song!");
			return;
		}
		playCommand(url, i);
	},
};

export default play;
