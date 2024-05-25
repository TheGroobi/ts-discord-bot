import fs from "node:fs";
import path from "node:path";
import { Client, Collection } from "discord.js";
import { Command } from "src/types";
import { loadModule } from "../utils/helper";

export default (c: Client): void => {
	c.commands = new Collection();
	const foldersPath = path.join(__dirname, "commands");
	const commandFiles = fs.readdirSync(foldersPath);
	let failed = 0;

	for (const f of commandFiles) {
		const filePath = path.join(foldersPath, f);
		const command = loadModule<Command>(filePath).default;
		//Add new item to the commands Collection
		if (command.data.name && command.data && "execute" in command) {
			c.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${f} is missing a required "data" or "execute" property`
			);
			failed++;
		}
	}
	console.log(
		`Successfully loaded ${commandFiles.length - failed} commands!` 
	);
};
