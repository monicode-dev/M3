const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        let current_time = new Date()
        await interaction.reply({ content: 'Pinging...' });

        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        const pingEmbed = new EmbedBuilder()
            .setTitle(`M3's Ping | 🏓`)
            .setColor("#eedced")
            .addFields({ name: "Round-trip latency:", value: `\`${current_time - interaction.createdTimestamp}ms\`` })
            .setFooter({ text: `M3`, iconURL: botAvatar })
            .setTimestamp()

        interaction.editReply({ content: "", embeds: [pingEmbed] });
    }
};
