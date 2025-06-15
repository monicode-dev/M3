const { SlashCommandBuilder } = require('discord.js');

const infoCmd = require("./subcommands/info.js")
const setCmd = require("./subcommands/set.js")
const viewCmd = require("./subcommands/view.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timezone')
        .setDescription('Timezone stuff!')
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("Get info about a specifc timezone.")
                .addStringOption(option =>
                    option
                        .setName('timezone')
                        .setDescription('The timezone in IANA format (eg. America/Denver or Europe/Athens).')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Set your timezone so others can see it.")
                .addStringOption(option =>
                    option
                        .setName('timezone')
                        .setDescription('The timezone in IANA format (eg. America/Denver or Europe/Athens).')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("View your or another user's timezone info")
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user you want to view timezone info of'))
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'info') {
            infoCmd.execute(interaction)
        } else if (subcommand === 'set') {
            setCmd.execute(interaction)
        } else if (subcommand === 'view') {
            viewCmd.execute(interaction)
        }
    }
};
