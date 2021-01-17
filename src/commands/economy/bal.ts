import { Message, User } from "discord.js";
import format from './numberFormatter'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message, args: string[]) {
    var targetUser: User
    if (msg.mentions.users.size != 0) { targetUser = msg.mentions.users.first() }
    else { targetUser = msg.author }

    var userData = await db.collection('users').doc(targetUser.id).get()
    var bal = (userData.exists && userData.data().bal) ? userData.data().bal : 0
    msg.channel.send(`**${targetUser.username}**'s balance is **${format.numberWithCommas(bal)}**xp`)
}

export default command