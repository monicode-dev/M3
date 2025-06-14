const { Events, PresenceUpdateStatus, ActivityType } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		let multiwords = ["Multipurpose", "Multifuncion", "Multiuse", "Multiversal", "Multidimensional", "Multipcation", "Multitasking", "Multifaceted", "Multilayered", "Multilevel", "Multicolored", "Multispecies", "Multithreaded", "Multiprocessing"]

		client.user.setStatus(PresenceUpdateStatus.Idle);
		client.statusChangeTimeout = undefined

		client.user.setActivity(`Monika's ${multiwords[Math.floor(Math.random() * multiwords.length)]} Machine`, { type: ActivityType.Custom });
		
		setInterval(function () {
			let newName = `Monika's ${multiwords[Math.floor(Math.random() * multiwords.length)]} Machine`
			client.user.setActivity(newName, { type: ActivityType.Custom });
			log.info(`Switching cannon name to "${newName}"`);
		}, 300_000);


		log.info(`Logged in as ${client.user.tag}`)
	}
};