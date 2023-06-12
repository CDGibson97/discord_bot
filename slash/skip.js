const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer, useQueue } = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    run: async({ client, interaction }) => {
        const queue = useQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("No songs in the queue")
        
        const currentSong = queue.currentSong

        queue.node.skip(true)
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`Skipped ${currentSong.title}`).setThumbnail(currentSong.thumbnail)
            ]
        })
    },
}