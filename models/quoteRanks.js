const Sequelize = require("sequelize");

module.exports = (sequelize) => {
    return {
        name: "quoteRanks",
        model: sequelize.define('quoteRanks', {
            quotee: Sequelize.BIGINT.UNSIGNED,
            quote_guild: Sequelize.BIGINT.UNSIGNED,
            quote_count: Sequelize.SMALLINT.UNSIGNED,
        })
    }
};
