const { SlashCommandBuilder } = require('discord.js');
const newCmd = require("./subcommands/new.js")
const removeCmd = require("./subcommands/remove.js")
const viewServerCmd = require("./subcommands/viewServer.js")
const viewUserCmd = require("./subcommands/viewUser.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quotes')
        .setDescription('View or manage quotes from server members.')
        .addSubcommand(subcommand =>
            subcommand
                .setName("new")
                .setDescription("Add a new quote.")
                .addUserOption(option =>
                    option
                        .setName('quotee')
                        .setDescription('Who said the quote?')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('quote')
                        .setDescription('What did they say?')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a stored quote")
                .addStringOption(option =>
                    option
                        .setName('quote_id')
                        .setDescription('What is the quote id?')
                        .setRequired(true))
        )
        .addSubcommandGroup(group =>
            group
                .setName("view")
                .setDescription("View quotes from the server or from a user")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("server")
                        .setDescription("View the quotes from the server")
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("user")
                        .setDescription("View the quotes from a user")
                        .addUserOption(option =>
                            option
                                .setName('quotee')
                                .setDescription('Who said the quotes?'))
                )
        ),
    async execute(interaction) {
        const subcommandGroup = interaction.options.getSubcommandGroup();
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'new') {
            newCmd.execute(interaction)
        } else if (subcommand === "remove") {
            removeCmd.execute(interaction)
        } else if (subcommandGroup === "view") {
            if (subcommand === "server") {
                viewServerCmd.execute(interaction)
            } else if (subcommand === "user") {
                viewUserCmd.execute(interaction)
            }
        }
    }
};
