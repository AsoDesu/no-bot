import { Message } from "discord.js";
import shortid from 'shortid'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

var restrictedUrls = [
    "signup",
    "twitch",
    "youtube",
    "twitter",
    "ping",
    "discord"
]

async function command(msg: Message) {
    const args = msg.content.slice(process.env.PREFIX.length).split(/ +/)
    args.shift()
    if (!(args.length >= 1)) {
        msg.reply("Usage >shorten (long url) [(short url)]")
        return;
    }

    var fullUrl = args[0]
    var shortUrl = args[1] ? args[1] : shortid.generate()

    if (!fullUrl.includes("http")) {
        msg.channel.send('That isn\'t a valid url')
        return;
    }

    if (restrictedUrls.includes(shortUrl) && !msg.member.hasPermission("ADMINISTRATOR")) {
        msg.channel.send('You can\'t use that short url')
        return;
    }

    var urlData = await db.collection("urls").doc(shortUrl).get()
    if (urlData.exists) {
        msg.channel.send('That short url already exists')
        return;
    }

    db.collection("urls").doc(shortUrl).set({
        full: fullUrl,
        owner: msg.author.id,
        clicks: 0,
    }, {merge: true})
    msg.channel.send(`Created a short url with the name ${shortUrl}, https://noclan.ml/${shortUrl}`)
}

export default command