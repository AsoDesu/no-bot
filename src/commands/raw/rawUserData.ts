import { Message } from "discord.js";

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message, args: string[]) {
    var userId: string = (msg.mentions.users.size == 0) ? msg.author.id : msg.mentions.users.first().id
    msg.channel.send(`\`\`\`${JSON.stringify((await db.collection('users').doc(userId).get()).data(), null, 2)}\`\`\``)
}

export default command