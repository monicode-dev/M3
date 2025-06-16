const { EmbedBuilder, MessageFlags } = require("discord.js");

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

module.exports = {
    async execute(interaction) {
        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        const timezone = interaction.options.getString('timezone');
        const timezoneInfo = await (await fetch(`http://worldtimeapi.org/api/timezone/${timezone.toLowerCase()}`)).json()

        if (timezoneInfo.utc_offset) {
            const timezoneModel = interaction.client.models.get("timezone")
            const userTimezone = await timezoneModel.findOne({ where: { user_id: interaction.user.id } })

            if (userTimezone) {
                userTimezone.update({ timezone: timezone }, { where: { user_id: interaction.user.id } })
            } else {
                timezoneModel.create({
                    user_id: interaction.user.id,
                    timezone: timezone
                })
            }

            const setTimezoneEmbed = new EmbedBuilder()
                .setTitle(`Successfully set your timezone!`)
                .setColor("#eedced")
                .setThumbnail(interaction.user.avatarURL())
                .addFields({ name: `${timezoneInfo.timezone.replace("_", " ")}:`, value: `UTC Offset: \`${timezoneInfo.utc_offset}\`` },)
                .setFooter({ text: `Powered by WorldTimeAPI.org`, iconURL: botAvatar })
                .setTimestamp()

            interaction.reply({ embeds: [setTimezoneEmbed], flags: MessageFlags.Ephemeral })
        } else {
            interaction.reply({ content: "Ivalid timezone!", flags: MessageFlags.Ephemeral });
        }
    }
}