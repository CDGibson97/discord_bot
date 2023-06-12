const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

const { useMasterPlayer } = require("discord-player");
const { YouTubeExtractor } = require("@discord-player/extractor");

const player = useMasterPlayer();
player.extractors.register(YouTubeExtractor);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Loads songs from Youtube")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option.setName("url").setDescription("The song url").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist from a url")
                .addStringOption((option) => option.setName("url").setDescription("The playlist url").setRequired(true))
                )
        .addSubcommand((subcommand) =>
                subcommand
                    .setName("search")
                    .setDescription("Loads a song from a search query")
                    .addStringOption((option) => option.setName("searchterms").setDescription("The search keywords").setRequired(true))
                ),

        run: async ({  interaction }) => {
        if (!interaction.member.voice.channel){
            return interaction.editReply("You need to be in the voice channel to use this command")
        }
        const queue = player.nodes.create(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new EmbedBuilder()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No songs were found")

            const song = result.tracks[0]
            queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration})` })
            let songtitle = song.title.toLowerCase();
            let check = songtitle.includes("budapest");
            if(check){
                interaction.editReply("Fuck you Nick")
            }

        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No songs were found")

            queue.addTrack(result)
            
            embed
                .setDescription(`**${result.tracks.length} songs from [${result.title}](${result.url})** has been added`)
                .setThumbnail(result.thumbnail)
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_SEARCH
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No songs were found")

            const song = result.tracks[0]
            await queue.addTrack(result.song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration})` })
        }
        if(!queue.playing) await queue.node.play()
        await interaction.editReply({
            embeds: [embed]
        })
    }
}