import { Message } from "discord.js";
import { url } from './utils'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message) {
    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/)
    if (!args[0]) {
        msg.reply("Usage >delurl (short url)")
        return;
    }

    var shortUrl = args[1]

    var urlData = await db.collection("urls").doc(shortUrl).get()
    if (!urlData.exists) {
        msg.channel.send('That short url doesn\'t exist')
        return;
    }

    var data = urlData.data() as url
    if (!(msg.author.id == data.owner) && !msg.member.hasPermission("ADMINISTRATOR")) {
        msg.channel.send("You have to be the owner of the short url to delete it")
        return;
    }

    db.collection("urls").doc(shortUrl).delete()
    msg.channel.send(`Deleted short url with the name ${shortUrl}`)
}

export default command