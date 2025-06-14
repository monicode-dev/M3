const { Events, PresenceUpdateStatus, ActivityType } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setStatus(PresenceUpdateStatus.Idle);
		client.statusChangeTimeout = undefined

		client.user.setActivity('Monika\'s Multipurpose Machine', { type: ActivityType.Custom });

		setInterval(function () {
			log("Task running...");
		}, 900_000);


		log.info(`Logged in as ${client.user.tag}`)
	}
};