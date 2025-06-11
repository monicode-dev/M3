const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const quotesModel = interaction.client.models.get("quotes")
        const quotee = interaction.options.getUser('quotee');
        const quote_guild = interaction.guildId;

        const userQuotes = await quotesModel.findAll({ where: { quotee: quotee.id, quote_guild: quote_guild } });

        function createResponseBody(page = 0) {
            const offset = page * 5

            const userQuotesEmbed = new EmbedBuilder()
                .setTitle(`${quotee.displayName}'s Quotes | Page ${page + 1}`)
                .setThumbnail(quotee.avatarURL())
                .setTimestamp()
                .setFooter({ text: `Showing ${offset}-${offset+5}/${userQuotes.length} | ${interaction.client.user.displayName}`, iconURL: interaction.client.user.avatarURL() });

            if (userQuotes.length !== 0) {
                for (let i = userQuotes.length - 1 - offset; i >= userQuotes.length - 1 - offset - 4; i--) {
                    if (userQuotes[i] !== undefined) {
                        userQuotesEmbed.addFields({ name: `\`\`\`ID: ${userQuotes[i].id}\`\`\``, value: "", inline: true })
                        userQuotesEmbed.addFields({ name: `<t:${new Date(userQuotes[i].createdAt).valueOf() / 1000}:f>:`, value: `\`\`\`${userQuotes[i].quote}\`\`\``, inline: true })
                        userQuotesEmbed.addFields({ name: "", value: "", inline: true })
                    }
                }
            } else {
                userQuotesEmbed.addFields({ name: `Well, this guy is boring`, value: `They don't have a single quote!` },)
            }

            if (userQuotes.length === 0) {
                return { embeds: [userQuotesEmbed] }
            } else {
                const prevPage = new ButtonBuilder()
                    .setCustomId('prevPage')
                    .setLabel('< Prev. Page')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(offset === 0)

                const nextPage = new ButtonBuilder()
                    .setCustomId('nexPage')
                    .setLabel('Next Page >')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(userQuotes[4 + offset + 1] === undefined);

                const row = new ActionRowBuilder()
                    .addComponents(prevPage, nextPage);

                return { embeds: [userQuotesEmbed], components: [row], withResponse: true }
            }
        }

        async function buttonLoop(response, page = 0) {
            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const userQuoteButtonResponse = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                if (userQuoteButtonResponse.customId === 'prevPage') {
                    page--
                    buttonLoop(await userQuoteButtonResponse.update(createResponseBody(page)), page)
                } else if (userQuoteButtonResponse.customId === 'nexPage') {
                    page++
                    buttonLoop(await userQuoteButtonResponse.update(createResponseBody(page)), page)
                }
            } catch {
                const responseBody = createResponseBody(page)
                await interaction.editReply({ content: "Timed out!", embeds: responseBody.embeds, components: [] });
            }
        }

        if (userQuotes.length === 0) {
            await interaction.reply(createResponseBody())
        } else {
            buttonLoop(await interaction.reply(createResponseBody()));
        }
    }
}