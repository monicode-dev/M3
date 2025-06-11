const chalk = require("chalk")

function getCurrentTime() {
    const now = new Date();

    let time = [now.getHours().toString(), now.getMinutes().toString(), now.getSeconds().toString()]

    if (time[0].toString().length === 1) time[0] = "0" + time[0]
    if (time[1].toString().length === 1) time[1] = "0" + time[1]
    if (time[2].toString().length === 1) time[2] = "0" + time[2]

    return `${time[0]}:${time[1]}:${time[2]}`;
}

let info = chalk.blue
let warn = chalk.yellow
let error = chalk.red
let debug = chalk.gray

function log(message, status = "info") {
    status = status.toLowerCase()
    if (status === "info") {
        console.log(info(`[${getCurrentTime()}] [INFO] ${message}`))
    } else if (status === "warn") {
        console.warn(warn(`[${getCurrentTime()}] [WARN] ${message}`))
    } else if (status === "error") {
        console.error(error(`[${getCurrentTime()}] [ERROR] ${message}`))
    } else if (status === "debug") {
        console.debug(debug(`[${getCurrentTime()}] [DEBUG] ${message}`))
    } 
}

module.exports = log