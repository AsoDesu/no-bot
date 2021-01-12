import {Client,TextChannel} from 'discord.js'

async function sendMessage(client: Client, message: string) {
    var channel = await client.channels.fetch(process.env.DUMBBOTCHANNEL)
    if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;
    channel.send(message)
}

export default sendMessage