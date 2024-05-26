import { Message } from "discord.js";
import { isValidURL } from "./helper";

export function handleCommand(message: Message) {
	const fullCommand = message.content.split("$").slice(1).join().split(" ");
	const command = fullCommand[0];
	const args = fullCommand.slice(1);

	if (command === "ping") {
		message.channel.send("Pong!");
	}

	if (command === "play" && args[0]) {
		handlePlayCommand(command, args[0], message);
	}
}

function handlePlayCommand(cmd: string, url: string, message: Message) {
	if (!isValidURL(url)) {
		message.channel.send(
			"The URL provided is not a valid song link, please try with a valid URL."
		);
		return;
	}
	console.log("Procceeding the play command...");
}
