import { Message } from "discord.js";
import 'dotenv/config'

async function give1(msg: Message, id: string) {
    var user = await msg.guild.members.fetch(id)
    var oneRole = await msg.guild.roles.fetch(process.env.ONEROLE)

    if (!user.roles.cache.has(process.env.ONEROLE)) {
        oneRole.members.forEach(user => {
            user.roles.remove(oneRole)
        })
        user.roles.add(oneRole)
    }
}

export default give1