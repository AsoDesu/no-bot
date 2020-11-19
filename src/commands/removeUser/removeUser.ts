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
    var userId = msg.mentions.users.first().id
    firestore.collection('users').doc(userId).get().then(async doc => {
        if (!doc.exists) {
            msg.reply('That user is not registered')
            return
        }

        var statusMsg = await msg.channel.send(`Deleting User`)
        await (await msg.guild.members.fetch()).get(userId).roles.remove(msg.guild.roles.cache.find(r => r.id == process.env.ROLE))
        await firestore.collection('users').doc(userId).delete()
        statusMsg.edit('Deleted.')
    })
}

export default command