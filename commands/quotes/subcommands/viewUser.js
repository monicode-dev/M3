const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const quotesModel = interaction.client.models.get("quotes")
        const quotee = interaction.options.getUser('quotee') || interaction.user;
        const quote_guild = interaction.guildId;

        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        const userQuotes = await quotesModel.findAll({ where: { quotee: quotee.id, quote_guild: quote_guild } });

        if (userQuotes.length === 0) {
            const noUserQuotesEmbed = new EmbedBuilder()
                .setTitle(`${quotee.displayName}'s Quotes`)
                .setThumbnail(quotee.avatarURL())
                .addFields({ name: `Well, this guy is boring`, value: `They don't have a single quote in this server!` },)
                .setFooter({ text: `Showing 0/0`, iconURL: botAvatar })
                .setTimestamp()

            await interaction.reply({ embeds: [noUserQuotesEmbed] })
        } else {
            function createResponseBody(page = 0, justEmbed = false) {
                const offset = page * 5

                const userQuotesEmbed = new EmbedBuilder()
                    .setTitle(`${quotee.displayName}'s Quotes | Page ${page + 1}`)
                    .setThumbnail(quotee.avatarURL())
                    .setTimestamp()
                    .setFooter({ text: `Showing ${offset}-${offset + 5}/${userQuotes.length}`, iconURL: botAvatar });

                if (offset + 5 > userQuotes.length) userQuotesEmbed.setFooter({ text: `Showing ${offset}-${userQuotes.length}/${userQuotes.length}`, iconURL: botAvatar })

                for (let i = userQuotes.length - 1 - offset; i >= userQuotes.length - 1 - offset - 4; i--) {
                    if (userQuotes[i] !== undefined) {
                        userQuotesEmbed.addFields({ name: `\`\`\`ID: ${userQuotes[i].id}\`\`\``, value: "", inline: true })
                        userQuotesEmbed.addFields({ name: `<t:${new Date(userQuotes[i].createdAt).valueOf() / 1000}:f>:`, value: `\`\`\`${userQuotes[i].quote}\`\`\``, inline: true })
                        userQuotesEmbed.addFields({ name: "", value: "", inline: true })
                    }
                }

                if (justEmbed) {
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
                    const responseBody = createResponseBody(page, true)
                    await interaction.editReply({ content: "Timed out!", embeds: responseBody.embeds, components: [] });
                }
            }

            buttonLoop(await interaction.reply(createResponseBody()));
        }
    }
}