import 'dotenv/config'
import { Message } from 'discord.js'

async function addRole(msg: Message) {
    var targetUser = msg.mentions.members.first()
    if (targetUser.roles.cache.has(process.env.ROLE)) {
        msg.reply('That user allready has the Member role')
        return
    }
    var role = msg.guild.roles.cache.find(r => r.id == process.env.ROLE)
    if (!role) {
        msg.reply('Role not found :(')
        return;
    }
    msg.member.roles.add(role)
    msg.channel.send(`Added ${targetUser.user.username} to the clan`)
}

export default addRole