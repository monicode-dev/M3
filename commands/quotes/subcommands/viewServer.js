const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const quotesModel = interaction.client.models.get("quotes")
        const quote_guild = interaction.guildId;

        const serverQuotes = await quotesModel.findAll({ where: { quote_guild: quote_guild } });

        function createResponseBody(page = 0) {
            const offset = page * 5

            const serverQuotesEmbed = new EmbedBuilder()
                .setTitle(`${interaction.guild.name}'s Quotes | Page ${page + 1}`)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({ text: `Showing ${offset}-${offset+5}/${serverQuotes.length} | ${interaction.client.user.displayName}`, iconURL: interaction.client.user.avatarURL() });

            if (serverQuotes.length !== 0) {
                for (let i = serverQuotes.length - 1 - offset; i >= serverQuotes.length - 1 - offset - 4; i--) {
                    if (serverQuotes[i] !== undefined) {
                        serverQuotesEmbed.addFields({ name: `\`\`\`ID: ${serverQuotes[i].id}\`\`\``, value: `<@${serverQuotes[i].quotee}>`, inline: true })
                        serverQuotesEmbed.addFields({ name: `<t:${new Date(serverQuotes[i].createdAt).valueOf() / 1000}:f>:`, value: `\`\`\`${serverQuotes[i].quote}\`\`\``, inline: true })
                        serverQuotesEmbed.addFields({ name: "", value: "", inline: true })
                    }
                }
            } else {
                serverQuotesEmbed.addFields({ name: `Well, this server is boring`, value: `No one has a single quote!` },)
            }

            if (serverQuotes.length === 0) {
                return { embeds: [serverQuotesEmbed] }
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
                    .setDisabled(serverQuotes[4 + offset + 1] === undefined);

                const row = new ActionRowBuilder()
                    .addComponents(prevPage, nextPage);

                return { embeds: [serverQuotesEmbed], components: [row], withResponse: true }
            }
        }

        async function buttonLoop(response, page = 0) {
            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const serverQuoteButtonResponse = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                if (serverQuoteButtonResponse.customId === 'prevPage') {
                    page--
                    buttonLoop(await serverQuoteButtonResponse.update(createResponseBody(page)), page)
                } else if (serverQuoteButtonResponse.customId === 'nexPage') {
                    page++
                    buttonLoop(await serverQuoteButtonResponse.update(createResponseBody(page)), page)
                }
            } catch {
                const responseBody = createResponseBody(page)
                await interaction.editReply({ content: "Timed out!", embeds: responseBody.embeds, components: [] });
            }
        }

        if (serverQuotes.length === 0) {
            await interaction.reply(createResponseBody())
        } else {
            buttonLoop(await interaction.reply(createResponseBody()));
        }
    }
}