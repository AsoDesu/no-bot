import { Message } from "discord.js";


function command(msg: Message, args: string[]) {
    msg.channel.send('We are friends with scuffed tourneys, you could go check them out: https://discord.gg/KkNrSyVTcd')
}

export default command