import 'dotenv/config'
import { Message } from 'discord.js'

async function addRole(msg: Message) {
    var role = msg.guild.roles.cache.find(r => r.name == "Member")

    if (!role) {
        msg.reply('Role not found :(')
        return;
    }

    if (!msg.member.roles.cache.has(process.env.ROLE)) {
        msg.member.roles.add(role)
    }

    msg.channel.send('Gave you the member role, welcome to the NOPE clan!')
}

export default addRole