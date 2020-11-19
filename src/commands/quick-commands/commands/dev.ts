import { Message, MessageEmbed } from "discord.js";

module.exports =  {
    name: "dev",
    execute(msg: Message, args: string[]) {
        msg.channel.send('Aso was here.......')
    }
}