const { Events, PresenceUpdateStatus } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setStatus(PresenceUpdateStatus.Idle);
		client.statusChangeTimeout = undefined

		log(`Logged in as ${client.user.tag}`)
	}
};