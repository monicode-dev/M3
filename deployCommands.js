const fs = require('node:fs');
const path = require('node:path');

const { REST, Routes } = require('discord.js');
require("dotenv").config()

const log = require("./lib/log.js")

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
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
			log.error(`The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		log.info(`Started refreshing ${commands.length} application (/) commands.`);

		let data;

		if (process.env.DEV === "yes") {
			data = await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
				{ body: commands }
			);
		} else {
			data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body: commands }
			);
		}

		log.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		log.trace(error);
	}
})();
