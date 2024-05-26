# ts-discord-bot

## Adding a new slash command

```
// Template for creating a slash command inside the commands folder:


import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types";

export default {
	data: new SlashCommandBuilder()
		.setName("name of your command")
		.setDescription("description of the command"),
	async execute(i) {
		await // code to execute here
	},
} satisfies Command["default"];



```
