const { EmbedBuilder } = require("discord.js");


module.exports = {
    async execute(interaction) {
        const quotesModel = interaction.client.models.get("quotes")
        const quoteRanksModel = interaction.client.models.get("quoteRanks")

        const quotee = interaction.options.getUser('quotee');
        const quote = interaction.options.getString('quote');

        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        quotesModel.create({
            quotee: quotee.id,
            quote_guild: interaction.guildId,
            quoter: interaction.user.id,
            quote: quote
        })

        const userQuoteCount = await quoteRanksModel.findOne({ where: { quotee: quotee.id, quote_guild: interaction.guildId } })

        if (userQuoteCount) {
            userQuoteCount.update({ quote_count: userQuoteCount.quote_count + 1 }, { where: { quotee: quotee.id, quote_guild: interaction.guildId } })
        } else {
            quoteRanksModel.create({
                quotee: quotee.id,
                quote_guild: interaction.guildId,
                quote_count: 1,
            })
        }

        const addedNewQuoteEmbed = new EmbedBuilder()
            .setTitle(`Successfully added new quote!`)
            .setThumbnail(quotee.avatarURL())
            .addFields({ name: `New quote for ${quotee.displayName}:`, value: `\`\`\`${quote}\`\`\`` },)
            .setFooter({ text: `M3`, iconURL: botAvatar })
            .setTimestamp()

        await interaction.reply({ embeds: [addedNewQuoteEmbed] });
    }
}