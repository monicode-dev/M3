const { Events } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.Error,
	execute(error) {
		log.trace(error)
	}
};