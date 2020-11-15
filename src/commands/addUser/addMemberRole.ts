import 'dotenv/config'
import { Message } from 'discord.js'

async function addRole(msg: Message) {
    if (msg.member.roles.cache.has(process.env.ROLE)) {
        msg.reply('You already have the member role <:kekchamp:777532686394720276>')
        return
    }
    var role = msg.guild.roles.cache.find(r => r.id == process.env.ROLE)
    if (!role) {
        msg.reply('Role not found :(')
        return;
    }
    msg.member.roles.add(role)
    msg.channel.send('Gave you the member role, welcome to the NOPE clan!')
}

export default addRole