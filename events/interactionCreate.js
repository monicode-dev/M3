const { Events, MessageFlags, PresenceUpdateStatus } = require('discord.js');
const log = require("../lib/log.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            log.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            clearTimeout(interaction.client.statusChangeTimeout)
            interaction.client.statusChangeTimeout = undefined
            interaction.client.user.setStatus(PresenceUpdateStatus.Online);
            
            await command.execute(interaction);
            
            interaction.client.statusChangeTimeout = setTimeout(() => {
                interaction.client.user.setStatus(PresenceUpdateStatus.Idle); 
            }, 60_000)
        } catch (error) {
            log.trace(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
        }
    }
};