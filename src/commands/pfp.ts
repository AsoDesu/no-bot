import { Message } from "discord.js";

function command(msg: Message, args: string[]) {
    if (msg.mentions.users.size == 0) {
        msg.channel.send('You need to provide a user')
        return
    }
    msg.channel.send(msg.mentions.users.first().avatarURL())
}

export default command