import { Message } from "discord.js";
import got from 'got'

async function command(msg: Message, args: string[]) {
    var data = JSON.parse((await got('https://nekos.life/api/v2/img/neko')).body)
    msg.channel.send(data.url)
}

export default command