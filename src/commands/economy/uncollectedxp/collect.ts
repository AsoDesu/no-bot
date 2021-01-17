import { Message } from "discord.js";
import numberFormatter from '../numberFormatter'

import cache from './cache'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message, args: string[]) {
    var userData = await db.collection('users').doc(msg.author.id).get()
    var bal = userData.exists && userData.data().bal ? userData.data().bal : 0

    var uncollectedbal = cache.cache.find(u => u.userid == msg.author.id).amount

    if (uncollectedbal < 1) {
        msg.channel.send(`You haven't collected enough xp to collect yet, You collected **${uncollectedbal.toFixed(2)}**, and need at least 1xp to collect`)
        return;
    } else {
        bal += parseFloat(uncollectedbal.toFixed(2))
        msg.channel.send(`You collected **${parseFloat(uncollectedbal.toFixed(2))}**xp, your balance is now **${bal}**xp`)
    }

    db.collection('users').doc(msg.author.id).set({
        bal: bal
    }, {merge: true})
}

export default command