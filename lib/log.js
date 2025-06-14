const pino = require('pino');

let level = "info"
if (process.env.DEV === "yes") level = "trace"

const log = pino({ level: level });

module.exports = log;

