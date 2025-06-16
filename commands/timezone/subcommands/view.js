const { EmbedBuilder } = require("discord.js");

const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

module.exports = {
    async execute(interaction) {
        const botAvatar = interaction.client.user.avatarURL() || interaction.client.user.defaultAvatarURL

        const timezoneModel = interaction.client.models.get("timezone")
        const otherUser = interaction.options.getUser("user")

        async function timezoneInfoEmbedBuilder(user) {
            let userAvatar = user.avatarURL() || user.defaultAvatarURL
            let timezone = await timezoneModel.findOne({ where: { user_id: user.id } })

            if (!timezone) {
                const timezoneInfoEmbed = new EmbedBuilder()
                    .setColor("#2d0343")
                    .setTitle(`${user.displayName}'s Timezone Info`)
                    .setThumbnail(userAvatar)
                    .setDescription(`${user.displayName} doesn't have their timezone setup!`)

                return timezoneInfoEmbed
            }

            const timezoneInfo = await (await fetch(`http://worldtimeapi.org/api/timezone/${timezone.timezone}`)).json()

            let offsetInMinutes = timezoneInfo.raw_offset / 60
            if (timezoneInfo.dst) offsetInMinutes += timezoneInfo.dst_offset / 60

            let date = dayjs(timezoneInfo.utc_datetime).utcOffset(offsetInMinutes)
            let dateFormated = date.format("dddd, MMMM D, YYYY")
            let time12HrFormated = date.format("hh:mm A")
            let time24HrFormated = date.format("HH:mm")

            const timezoneInfoEmbed = new EmbedBuilder()
                .setColor("#eedced")
                .setTitle(`${user.displayName}'s Timezone Info`)
                .setThumbnail(userAvatar)
                .addFields({ name: `${timezoneInfo.timezone.replace("_", " ")}:`, value: `UTC Offset: \`${timezoneInfo.utc_offset}\``, inline: true })
                .addFields({ name: "Current Date and Time:", value: `Date: \`${dateFormated}\`\nTime (24hr): \`${time24HrFormated}\`\nTime (12hr): \`${time12HrFormated}\``, inline: true })
                .setFooter({ text: `Powered by WorldTimeAPI.org`, iconURL: botAvatar })
                .setTimestamp()

            if (timezoneInfo.dst_from && timezoneInfo.dst_until) {
                if (timezoneInfo.dst) {
                    timezoneInfoEmbed.addFields({ name: "Daylight Savings Time:", value: `It is currently DST for ${timezoneInfo.timezone.replace("_", " ")}\n\nDST Start: <t:${new Date(timezoneInfo.dst_from).valueOf() / 1000}:f>\nDST End: <t:${new Date(timezoneInfo.dst_until).valueOf() / 1000}:f>` })
                } else {
                    timezoneInfoEmbed.addFields({ name: "Daylight Savings Time:", value: `It is currently not DST for ${timezoneInfo.timezone.replace("_", " ")}\n\nDST Start: <t:${new Date(timezoneInfo.dst_from).valueOf() / 1000}:f>\nDST End: <t:${new Date(timezoneInfo.dst_until).valueOf() / 1000}:f>` })
                }
            } else {
                timezoneInfoEmbed.addFields({ name: "Daylight Savings Time:", value: `${timezoneInfo.timezone.replace("_", " ")} does not participate in DST` })
            }

            return timezoneInfoEmbed;
        }

        if (otherUser) {
            interaction.reply({ embeds: [await timezoneInfoEmbedBuilder(otherUser)] });
        } else {
            interaction.reply({ embeds: [await timezoneInfoEmbedBuilder(interaction.user)] });
        }
    }
}