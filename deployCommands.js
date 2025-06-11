const fs = require('node:fs');
const path = require('node:path');

const { REST, Routes } = require('discord.js');
require("dotenv").config()

const log = require("./lib/log.js")

const commands = [];

const foldersPath = path.join(path.dirname(), 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			log(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warn");
		}
	}
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands }
		);

		log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
