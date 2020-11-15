import { Message } from "discord.js";

import firebase, { auth } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import '../../firebaseinnit'

var firestore = firebase.firestore()

function command(msg: Message, args: string[]) {
    var userId = msg.mentions.users.first().id
    firestore.collection('users').doc(userId).get().then(doc => {
        if (!doc.exists) {
            msg.reply('That user is not registered')
            return
        }
        msg.channel.send(`https://scoresaber.com/u/${doc.data().scoresaberId}`)
    })
}

export default command