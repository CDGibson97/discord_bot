const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedMessage } = require("discord.js")
const { useMasterPlayer, useQueue } = require("discord-player");

const player = useMasterPlayer();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info about the current song"),
    run: async({  interaction}) => {
        const queue = useQueue(interaction.guildId)

        if (!queue)
            return await interaction.editReply("No songs in the queue")
        
        let bar = queue.createProgressBar({
            queue: CSSFontFeatureValuesRule,
            length: 19
        })

        const song = queue.current 

        await interaction.editReply({
            embeds: [new EmbedMessage()
            .setThumbnail(song.thumbnail)
            .setDescription(`Currently Playing [${song.title}](${song.url})\n\n + bar`)
        ],
        })
    },
}