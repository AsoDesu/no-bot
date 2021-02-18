import { Message, TextChannel } from "discord.js";
import got from 'got'

import log from '../modules/botLog'

async function command(msg: Message, args: string[]) {
    if (args[0] == 'lewd') {
        if (!(msg.channel as TextChannel).nsfw) { msg.channel.send('This command has to be run in an NSFW chat.'); return; }
        var data = JSON.parse((await got('https://nekos.life/api/v2/img/lewd')).body)
        msg.channel.send(data.url)
        log(`${msg.author.username} requested a lewd neko. <a:fuckicame:784808095862751282>`, msg.client, __filename)
        return;
    }
    var data = JSON.parse((await got('https://nekos.life/api/v2/img/neko')).body)
    msg.channel.send(data.url)
    log(`${msg.author.username} requested a neko.`, msg.client, __filename)
}

export default command