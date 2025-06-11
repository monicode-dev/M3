const path = require("node:path");
const fs = require("fs");

const log = require("../log.js")

module.exports = (client, Discord) => {
    client.commands = new Discord.Collection();
    const foldersPath = path.join(path.dirname(), '../commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                log(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warn");
            }
        }
    }

    log("Command handler loaded!")
}