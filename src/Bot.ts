import { configDotenv } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import ready from "./utils/ready";
import readyCommands from "./utils/readyCommands";

configDotenv();

const token = process.env.DISCORD_BOT_TOKEN;

console.log("Bot is starting...");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

ready(client);
readyCommands(client);

client.login(token);