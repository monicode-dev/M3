const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const quoteRanksModel = interaction.client.models.get("quoteRanks")
        const quotesModel = interaction.client.models.get("quotes")

        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        const serverQuoteStats = await quotesModel.findAll({ where: { quote_guild: interaction.guildId } })

        let totalServerQuotes = serverQuoteStats.length

        if (totalServerQuotes === 0) {
            const noServerQuotesEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}'s Quotes Stats`)
                .setColor("#8461aa")
                .setThumbnail(interaction.guild.iconURL())
                .addFields({ name: `Well, this server is boring`, value: `No one has a single quote!` })
                .setFooter({ text: `M3`, iconURL: botAvatar })
                .setTimestamp()

            await interaction.reply({ embeds: [noServerQuotesEmbed] });
        } else {
            const serverMembersQuoteStats = await quoteRanksModel.findAll({ where: { quote_guild: interaction.guildId } })
            const oldestQuoteDate = await quotesModel.min("createdAt")
            const newestQuoteDate = await quotesModel.max("createdAt")

            let ranked = [{ quote_count: 0 }]
            for (let i = 0; i < serverMembersQuoteStats.length; i++) {
                const rankEntry = serverMembersQuoteStats[i];

                if (rankEntry.quote_count >= ranked[0].quote_count) {
                    ranked.splice(0, 0, rankEntry)
                } else if (rankEntry.quote_count >= ranked[1].quote_count) {
                    ranked.splice(1, 0, rankEntry)
                } else if (rankEntry.quote_count >= ranked[2].quote_count) {
                    ranked.splice(2, 0, rankEntry)
                } else if (rankEntry.quote_count >= ranked[3].quote_count) {
                    ranked.splice(3, 0, rankEntry)
                } else if (rankEntry.quote_count >= ranked[4].quote_count) {
                    ranked.splice(4, 0, rankEntry)
                }
            }

            ranked.pop()

            const serverStatsEmbeds = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}'s Quotes Stats`)
                .setColor("#eedced")
                .setThumbnail(interaction.guild.iconURL())
                .addFields({ name: "Server Stats:", value: `Total quotes: ${totalServerQuotes}\nOldest quote: <t:${new Date(oldestQuoteDate).valueOf() / 1000}:f>\nNewest quote: <t:${new Date(newestQuoteDate).valueOf() / 1000}:f>`, inline: true })
                .addFields({ name: "", value: "", inline: true })
                .addFields({ name: "", value: "", inline: true })
                .setFooter({ text: `M3`, iconURL: botAvatar })
                .setTimestamp()

            let valueText = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"]

            for (let i = 0; i < 5; i++) {
                const rankedEntry = ranked[i];

                if (rankedEntry) {
                    const quotee = await interaction.client.users.fetch(rankedEntry.quotee)

                    valueText[i] = valueText[i] + `: \`${quotee.displayName}\` with ${rankedEntry.quote_count} quotes`
                } else {
                    delete valueText[i]
                }
            }
            serverStatsEmbeds.addFields({ name: "Member Rankings:", value: valueText.join("\n"), inline: true })

            await interaction.reply({ embeds: [serverStatsEmbeds] });
        }
    }
}