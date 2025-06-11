const fs = require('node:fs');
const path = require('node:path');

const Discord = require('discord.js');
require("dotenv").config();

const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });

const handlersFolder = path.join(__dirname, "handlers");
const handlerFiles = fs.readdirSync(handlersFolder).filter(file => file.endsWith('.js'));
for (const file of handlerFiles) {
    const handlerPath = path.join(handlersFolder, file);
    require(handlerPath)(client, Discord);
}

client.login(process.env.TOKEN);
