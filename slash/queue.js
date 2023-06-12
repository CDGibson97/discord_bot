const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useMasterPlayer, useQueue } = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the current song queue")
        .addNumberOption((option) => option.setName("page").setDescription("The page number of the queue").setMinValue(1)),

    run: async ({ interaction }) => {
        const queue = useQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            return await interaction.editReply("No songs in the queue")
        }

        const totalPages = Math.ceil(queue.tracks.length / 10) || 1
        const page = (interaction.options.getNumber("page") || 1) - 1

        if (page > totalPages)
            return await interaction.editReply(`Invalid page number. There is only ${totalPages} pages`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}. \ [${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>**`
        }).join("\n")

    const currentSong = queue.currentSong
    
    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
            .setDescription(`**Currently Playing**\n` +
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
            `\n\n**Queue**\n${queueString}`
            )
            .setFooter({
                text: `Page ${page + 1} of ${totalPages}`
            })
            .setThumbnail(currentSong.thumbnail)
        ]
    })
}
}