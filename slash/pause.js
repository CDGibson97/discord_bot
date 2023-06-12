const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer, useQueue} = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the music"),
    run: async({  interaction }) => {
        const queue = useQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply("No songs in the queue")
        
        queue.node.setPaused(true)
        await interaction.editReply("Music has been pause! Use `/resume` to resume the music`")
    }
}