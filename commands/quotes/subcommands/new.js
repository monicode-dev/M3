module.exports = {
    async execute(interaction) {
        const quotesModel = interaction.client.models.get("quotes")

        const quotee = interaction.options.getUser('quotee');
        const quote_guild = interaction.guildId;
        const quote = interaction.options.getString('quote');

        quotesModel.create({
            quotee: quotee.id,
            quote_guild: quote_guild,
            quoter: interaction.user.id,
            quote: quote
        })

        await interaction.reply(`Quoting <@${quotee.id}>\n> ${quote}`);
    }
}