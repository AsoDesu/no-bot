import { Message } from "discord.js";

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import '../../firebaseinnit'

var firestore = firebase.firestore()

function command(msg: Message, args: string[]) {
    var userId = msg.member.id
    firestore.collection('users').doc(userId).get().then(async doc => {
        if (!doc.exists) {
            msg.reply('That user is not registered')
            return
        }

        var statusMsg = await msg.channel.send(`Deleting User`)
        await msg.member.roles.remove(msg.guild.roles.cache.find(r => r.id == process.env.ROLE))
        await firestore.collection('users').doc(userId).delete()
        statusMsg.edit('Deleted.')
    })
}

export default command