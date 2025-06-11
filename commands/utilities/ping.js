const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        let current_time = new Date()
        await interaction.reply({ content: 'Pinging...' });
        interaction.editReply(`Round-trip latency: ${current_time - interaction.createdTimestamp}ms`);
    },
};
