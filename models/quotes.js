const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    return {
        name: "quotes",
        model: sequelize.define('quotes', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            quotee: Sequelize.BIGINT.UNSIGNED,
            quote_guild: Sequelize.BIGINT.UNSIGNED,
            quoter: Sequelize.BIGINT.UNSIGNED,
            quote: Sequelize.TEXT
        })
    }
};
