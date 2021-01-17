import { Channel, Message, MessageEmbed, TextChannel } from 'discord.js'
import gh from './github-api/github'
import './github-api/types'
import randColour from '../../randomColor'

async function command(msg: Message, args: string[]) {
    if (!msg.member.hasPermission("MANAGE_GUILD")) {
        msg.channel.send('You don\'t have permission to do that')
        return;
    }
    if (!args[0].includes('https://github.com/')) {
        msg.channel.send('That is not a valid link')
        return;
    }
    var repo = await gh.getRepo(args[0])
    if (!repo) {
        msg.channel.send('Repo not found')
        return;
    }

    var modEmbed = {
        "title": `${repo.name}`,
        "description": `${repo.description != null ? repo.description : "No description provided"}`,
        "color": randColour(),
        "fields": [
            { "name": "GitHub", "value": `[GitHub](${args[0]})`, "inline": true },
            { "name": "Download", "value": `[Releases](${repo.svn_url}/releases)`, "inline": true }
        ],
        "footer": {
            "text": `${repo.owner.login}`,
            "icon_url": `${repo.owner.avatar_url}`
        }
    }

    var modchannel = msg.client.channels.cache.get(process.env.MODCHANNEL)
    if (!((modchannel): modchannel is TextChannel => modchannel.type === 'text')(modchannel)) return;
    modchannel.send(new MessageEmbed(modEmbed))
    msg.channel.send('Added Mod')
}

export default command