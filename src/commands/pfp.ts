import { Message } from "discord.js";

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import '../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message, args: string[]) {
    if ((msg.mentions.users.size == 0 && isNaN(parseInt(args[0])))) {
        msg.channel.send('You need to provide a user')
        return
    }
    if (isNaN(parseInt(args[0]))) {
        msg.channel.send(msg.mentions.users.first().avatarURL())
    } else {
        var data = (await db.collection('users').where('scoresaberId', '==', args[0]).get()).docs[0]
        var user = msg.guild.members.cache.get(data.id)
        msg.channel.send(user.user.avatarURL())
    }
}

export default command