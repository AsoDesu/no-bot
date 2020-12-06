import { Client, MessageEmbed, TextChannel } from 'discord.js'

import randColor from '../randomColor'

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import '../firebaseinnit'

var database = firebase.firestore()

async function changeLog(client: Client) {
    var changes = (await database.collection('info').doc('changelog').get()).data()

    var guild = await client.guilds.fetch(process.env.GUILDID)
    var channel = guild.channels.cache.get(process.env.CHANNELID)
    if (!((channel): channel is TextChannel => channel.type === 'text')(channel)) return;

    var changelogEmbed = new MessageEmbed({
        "title": changes.title,
        "description": '- ' + changes.content.join('\n - '),
        "color": randColor(),
        "author": {
            "name": `v${changes.version}`
        }
    })

    channel.send(changelogEmbed)
}

export default changeLog