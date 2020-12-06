import { Message, MessageEmbed } from "discord.js";

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
            "name": ">help",
            "value": "Shows this menu",
        },
        {
            "name": ">leaderboard",
            "value": "Show's a leaderboard of all members of the NOPE clan (Global limit of 2 minutes)"
        },
        {
            "name": ">link (twitch | birthday) {twitch/birthday}",
            "value": "Links twitch or birthday to your nope clan profile"
        },
        {
            "name": ">dev",
            "value": "Shows the developer of this very dumb bot"
        }
    ]
})

function command(msg: Message, args: string[]) {
    helpEmbed.setColor(Math.floor(Math.random() * 16777215))
    msg.channel.send(helpEmbed)
}

export default command