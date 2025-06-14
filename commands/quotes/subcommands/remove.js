const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction) {
        const quotesModel = interaction.client.models.get("quotes")

        const quote_id = interaction.options.getString('quote_id');
        const quoteById = await quotesModel.findOne({ where: { id: quote_id } })


        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        if (!quoteById || quoteById?.quote_guild !== interaction.guildId) {
            await interaction.reply("Invaild ID!")
        } else {
            const cancelDelete = new ButtonBuilder()
                .setCustomId('cancelDelete')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary)

            const confirmDelete = new ButtonBuilder()
                .setCustomId('confirmDelete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)

            const row = new ActionRowBuilder().addComponents(cancelDelete, confirmDelete);

            const quotee = await interaction.client.users.fetch(quoteById.quotee)

            const toBeDeletedQuoteEmbed = new EmbedBuilder()
                .setTitle(`Quote from ${quotee.displayName}`)
                .setColor("#2d0343")
                .setThumbnail(quotee.avatarURL())
                .addFields({ name: `\`\`\`ID: ${quoteById.id}\`\`\``, value: "", inline: true })
                .addFields({ name: `<t:${new Date(quoteById.createdAt).valueOf() / 1000}:f>:`, value: `\`\`\`${quoteById.quote}\`\`\``, inline: true })
                .addFields({ name: "", value: "", inline: true })
                .setFooter({ text: `M3`, iconURL: botAvatar })
                .setTimestamp()

            async function doubleCheck(response, pass = 0) {
                const collectorFilter = i => i.user.id === interaction.user.id;

                row.components[1].setLabel("Yes, delete")

                try {
                    const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                    if (confirmation.customId === 'confirmDelete') {
                        if (pass === 0) {
                            const secondDeleteQuoteResponse = await confirmation.update({ content: `Are you absolutely sure you want to delete the following quote?:`, components: [row], withResponse: true });
                            doubleCheck(secondDeleteQuoteResponse, 1)
                        } else {
                            await quotesModel.destroy({ where: { id: quote_id } })
                            await confirmation.update({ content: `Deleted the following quote:`, components: [] });
                        }
                    } else if (confirmation.customId === 'cancelDelete') {
                        await confirmation.update({ content: 'Delete was cancelled.', components: [], embeds: [] });
                    }
                } catch {
                    await interaction.editReply({ content: 'Confirmation not received within 30 seconds, cancelling delete.', components: [], embeds: [] });
                }
            }

            const deleteQuoteResponse = await interaction.reply({ content: "Are you sure you want to delete the following quote?:", embeds: [toBeDeletedQuoteEmbed], components: [row], withResponse: true })

            doubleCheck(deleteQuoteResponse)
        }
    }
}