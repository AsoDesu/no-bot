import { Message } from "discord.js";
import 'dotenv/config'

async function give1(msg: Message, id: string) {
    var user = msg.guild.member(id)
    var oneRole = await msg.guild.roles.fetch(process.env.ONEROLE)

    if (!user.roles.cache.has(process.env.ONEROLE)) {
        oneRole.members.forEach(user => {
            user.roles.remove(oneRole)
        })
        user.roles.add(oneRole)
        user.send('You got #1 on the NO clan leaderboard!!')
    }
}

export default give1