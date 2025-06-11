const { Events } = require('discord.js');
const log = require("../log.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.globalName = "M^3"
		log(`Logged in as ${client.user.tag}`)
	}
};