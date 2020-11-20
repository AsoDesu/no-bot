import { Message } from "discord.js";

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import '../../firebaseinnit'

var firestore = firebase.firestore()

function command(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_ROLES')) {
        msg.reply('You can\'t do that!')
    }

    if (msg.mentions.users.size == 0) {
        msg.reply('User not provided')
        return
    }
    var user = msg.mentions.members.first()
    firestore.collection('users').doc(user.id).get().then(async doc => {
        if (!doc.exists) {
            msg.reply('That user is not registered')
            return
        }

        msg.channel.startTyping()
        await (user.roles.remove(msg.guild.roles.cache.find(r => r.id == process.env.ROLE)))
        await firestore.collection('users').doc(user.id).delete()
        msg.channel.send('Deleted.')
        msg.channel.stopTyping(true)
    })
}

export default command