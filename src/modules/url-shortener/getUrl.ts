import { Message, MessageEmbed } from "discord.js";
import {url} from './utils'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message) {
    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/)
    if (!args[0]) {
        msg.reply("Usage >geturl (short url)")
        return;
    }

    var shortUrl = args[1]

    var urlData = await db.collection("urls").doc(shortUrl).get()
    if (!urlData.exists) {
        msg.channel.send('That short doesn\'t exist')
        return;
    }
    var data = urlData.data() as url

    msg.channel.send(new MessageEmbed({
        title: "Short URL",
        description: `[Full Url](${data.full})`,
        fields: [
            { "name": "Url Name", "value": urlData.id, inline: true },
            { "name": "Clicks", "value": data.clicks, inline: true },
            { "name": "Owner", "value": `<@${data.owner}>`, inline: true }
        ]
    }))
}

export default command