const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer, useQueue} = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stops the bot and clears the queue"),
    run: async({interaction}) => {
        const queue = useQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply("No songs in the queue")
        
        queue.delete()
        await interaction.editReply("Goodbye")
    }
}