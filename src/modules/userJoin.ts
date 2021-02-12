import { GuildMember, MessageEmbed, PartialGuildMember } from 'discord.js'
import getOwnerIcon from './getOwnerIcon';
import log from './botLog'

function userJoin(member: GuildMember | PartialGuildMember) {
    if (!(member instanceof GuildMember)) return;
    member.send(new MessageEmbed({
        "title": "You Made it!!!!",
        "description": "You've managed to make it to our small corner of the Beat Saber Community\nWelcome to the NOPE Clan, let me show you around\n\nGet all the info you need about the clan in <#786276672034701352>\nHave General Converstaions in <#777110342723043390>\nSpam your bot commands in <#777274520875827220>\nAnd talk about your hottest pp plays in <#777111151312896001>\n\nWant to join the clan, simply do the >add command followed by your scoresaber link, like this\n`>add https://scoresaber.com/u/76561198272266872`\nDon't worry, you don't have to add NO | into your name, allthough it is nice\n\nWe hope you enjoy your stay\n- Dumb Bot",
        "footer": {
            "text": "Created by Aso#0001 <3",
            "iconURL": getOwnerIcon(member.guild)
        }
    }))

    log(`${member.user.username} joined.`, member.client, __filename)
}

export default userJoin