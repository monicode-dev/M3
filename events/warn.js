const { Events } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.Warn,
	execute(warn) {
		log.error(warn)
	}
};