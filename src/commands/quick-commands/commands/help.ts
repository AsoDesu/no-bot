import { Message, MessageEmbed } from 'discord.js'
import randColor from '../../../randomColor'

var helpEmbed = new MessageEmbed({
    "title": "No Clan Bot",
    "footer": {
        "icon_url": "https://cdn.discordapp.com/avatars/580425653325791272/a_3f2acc778b557be3d58156b5b1262158.png",
        "text": "Created by Aso#0001 <3"
    },
    "fields": [
        {
            "name": ">add {scoresaber link}",
            "value": "Adds yourself to the clan!",
        },
        {
            "name": ">user {user}",
            "value": "Get scoresaber link of a user",
        },
        {
            "name": ">remove",
            "value": "Removes yourself from the clan :(",
        },
        {
            "name": ">help",
            "value": "Shows this menu",
        }
    ]
})

module.exports = {
    name: "help",
    execute(msg: Message, args: string[]) {
        helpEmbed.setColor(randColor())
        msg.channel.send(helpEmbed)
    }
}   