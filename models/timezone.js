const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    return {
        name: "timezone",
        model: sequelize.define('timezone', {
            user_id: Sequelize.BIGINT.UNSIGNED,
            timezone: Sequelize.TEXT
        })
    }
};
