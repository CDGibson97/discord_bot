const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer, useQueue} = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the queue"),
    run: async({ interaction }) => {
        const queue = useQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply("No songs in the queue")
        
        queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled`)
    }
}