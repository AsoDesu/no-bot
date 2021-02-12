import { Message } from 'discord.js'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

import log from '../../modules/botLog'

async function command(msg: Message, args: string[]) {
    var userfData = await db.collection('users').doc(msg.author.id).get()
    if (!userfData.exists || !userfData.data().bal) { msg.channel.send('You do not have enough xp to level up, Do >play to get xp'); return; }
    var userData = userfData.data()

    var bal = userData.bal
    var level = userData.level ? userData.level : 1
    var upToLevel = Math.floor(bal / 1000) + 1
    if (level == upToLevel || level > upToLevel) { msg.channel.send('You do not have enough xp to level up, Do >play to get xp'); return; }

    db.collection('users').doc(userfData.id).set({
        level: upToLevel
    }, { merge: true })

    if (upToLevel >= 2) {
        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == 'Level 2'))
    } else if (upToLevel >= 5) {
        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == 'Level 5'))
    } else if (upToLevel >= 10) {
        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == 'Level 10'))
    } else if (upToLevel >= 15) {
        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == 'Level 15'))
    } else if (upToLevel >= 20) {
        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == 'Level 20'))
    } else if (upToLevel >= 30) {
        msg.member.roles.add(msg.guild.roles.cache.find(role => role.name == 'Level 30+'))
    }

    msg.channel.send(`You leveled up from level **${level}** to level **${upToLevel}**`)
    log(`${msg.author.username} leveled up.`, msg.client, __filename)
}

export default command