import { Client } from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { Command } from "src/types";

export default (c: Client): void => {
	const foldersPath = path.join(__dirname, "commands");
	const commandFiles = fs.readdirSync(foldersPath);

	for (const f of commandFiles) {
		const filePath = path.join(foldersPath, f);
		const command: Command = require(filePath).default;
		
		//Add new item to the commands Collection
		if (command.data.name && command && "execute" in command) {
			c.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${f} is missing a required "data" or "execute" property`
			);
		}
	}
	console.log(`Successfully loaded ${commandFiles.length} commands!`);
};
