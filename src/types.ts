import type {
	CommandInteraction,
} from "discord.js";

export interface Command {
	default: {
		data: any;
		execute: (interaction: CommandInteraction) => Promise<void>;
	};
}
