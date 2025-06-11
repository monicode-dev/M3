const { Events } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		log(`Logged in as ${client.user.tag}`)
	}
};