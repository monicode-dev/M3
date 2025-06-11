const path = require("node:path");
const fs = require("fs");

const Sequelize = require("sequelize");
require("dotenv").config();

const log = require("../lib/log.js");

module.exports = (client, Discord) => {
    client.models = new Discord.Collection()

    const sequelize = new Sequelize('06bdc63dc2-discord', process.env.DB_USER, process.env.DB_PASS, {
        host: 'mysql.shockbyte.bhs1.shockbyte.host',
        port: 3306,
        dialect: 'mysql',
        logging: false
    });

    const folderPath = path.join(__dirname, '../models');
    const modelFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of modelFiles) {
        const filePath = path.join(folderPath, file);
        const modelFile = require(filePath)(sequelize);

        if ('name' in modelFile && 'model' in modelFile) {
            client.models.set(modelFile.name, modelFile.model)
            modelFile.model.sync()
        } else {
            log(`The database model at ${filePath} is missing a required "name" or "model" property.`, "warn");
        }

    }

    log("Database handler loaded!")
}