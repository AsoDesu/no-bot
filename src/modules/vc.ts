import { Client, VoiceChannel } from "discord.js";
import 'dotenv/config'

async function connect(client: Client) {
    var vc = await client.channels.fetch(process.env.VCCHANNEL)
    if (!((vc): vc is VoiceChannel => vc.type === 'voice')(vc)) return;
    vc.join()
}

async function disconnect(client: Client) {
    var vc = await client.channels.fetch(process.env.VCCHANNEL)
    if (!((vc): vc is VoiceChannel => vc.type === 'voice')(vc)) return;
    vc.leave()
}

export default {
    join: connect,
    leave: disconnect
}