const { Events } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
	name: Events.Debug,
	execute(debug) {
		log.debug(debug)
	}
};