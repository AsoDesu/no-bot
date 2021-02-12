import { GuildMember, PartialGuildMember } from 'discord.js'

import firebase from 'firebase'
import 'firebase/firestore'
import '../firebaseinnit'
var db = firebase.firestore()

import log from './botLog'

async function userLeave(member: GuildMember | PartialGuildMember) {
    if (!(member instanceof GuildMember)) return;
    
    var userRef = await db.collection('users').doc(member.id).get()
    if (!userRef.exists) return;

    userRef.ref.delete()
    log(`${member.user.username} left.`, member.client, __filename)
}

export default userLeave