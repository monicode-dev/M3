const path = require("node:path");
const fs = require("fs");

const log = require("../lib/log.js");

module.exports = (client, _) => {
    const folderPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const filePath = path.join(folderPath, file);
        const event = require(filePath);
        
        if ('name' in event && 'execute' in event) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        } else {
            log(`The event ${file} is missing a required "name" or "execute" property.`, "warn");
        }
    }

    log("Event handler loaded!")
}