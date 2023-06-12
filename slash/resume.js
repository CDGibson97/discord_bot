const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer, useQueue} = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the music"),
    run: async({client, interaction}) => {
        const queue = useQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply("No songs in the queue")
        
        queue.node.setPaused(false)
        await interaction.editReply("Music has been resumed! Use `/pause` to pause the music`")
    }
}