import { Client, MessageEmbed, TextChannel } from 'discord.js'

import randColor from '../randomColor'

var changes = {
    version: "0.1.22",
    title: "Minor Update",
    content: [
        "Added Changelog whenever the bot restarts",
        "Changed/Moved/Organised some files",
        "Added another meme that storm wanted me to add",
        "Probably more i forgot"
    ]
}

async function changeLog(client: Client) {
    var guild = await client.guilds.fetch(process.env.GUILDID)
    var channel = guild.channels.cache.get(process.env.CHANNELID)
    if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

    var changelogEmbed = new MessageEmbed({
        "title": changes.title,
        "description": '- ' + changes.content.join('\n - '),
        "color": randColor(),
        "author": {
            "name": `v${changes.version}`
        }
    })

    channel.send(changelogEmbed)
}

export default changeLog