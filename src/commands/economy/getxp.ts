import { Message } from "discord.js";
import numberFormatter from './numberFormatter'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

async function command(msg: Message, args: string[]) {
    var userData = await db.collection('users').doc(msg.author.id).get()
    var currentBal: number
    if (userData.exists && userData.data().bal) {
        if (((msg.createdTimestamp - userData.data().balLastRun) < 3600000)) {
            var tryAgainIn = ( (msg.createdTimestamp - userData.data().balLastRun) - 3600000) * -1
            msg.channel.send('This command was last run less than an hour ago, try again in ' + numberFormatter.msToMandS(tryAgainIn))
            return;
        }
        currentBal = userData.data().bal
    } else {
        currentBal = 0
    }

    var balGive = Math.floor(Math.random() * 100)
    await db.collection('users').doc(msg.author.id).set({
        bal: currentBal += balGive,
        balLastRun: msg.createdTimestamp
    }, {merge: true}).catch(() => { msg.channel.send('Something went wrong, please try again later') })

    msg.channel.send(getMessage(balGive))
}

function getMessage(balGive: number) {
    if (balGive < 10) {
        return `You searched and search but only found **${balGive}**xp`
    } else if (balGive < 30) {
        return `You found a mini chest and found **${balGive}**xp`
    } else if (balGive < 50) {
        return `You found a large chest and found **${balGive}**xp`
    } else if (balGive < 80) {
        return `You found a house, inside was **${balGive}**xp`
    } else if (balGive < 100) {
        return `You found the rarest chest and gained **${balGive}**xp`
    }
}

export default command