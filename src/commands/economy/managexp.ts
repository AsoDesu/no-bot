import { Message } from "discord.js";

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

import log from '../../modules/botLog'

// Manage User Xp
async function givexp(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
        msg.channel.send('You can\'t do this')
        return;
    }
    if (msg.mentions.members.size == 0 || !args[1] || isNaN(parseInt(args[1]))) {
        msg.channel.send('Usage: `>addxp (user) (amount)`')
        return;
    }
    var userData = await db.collection('users').doc(msg.mentions.members.first().id).get()
    var bal = (userData.exists && userData.data().bal) ? userData.data().bal : 0

    bal += parseInt(args[1])
    db.collection('users').doc(msg.mentions.members.first().id).set({
        bal: bal
    }, { merge: true })
    msg.channel.send(`Gave **${args[1]}**xp to **${msg.mentions.users.first().username}**, their balance is now **${bal}**xp`)
    log(`${msg.author.username} gave ${msg.mentions.users.first()} ${args[1]}xp`, msg.client, __filename)
}

async function removexp(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
        msg.channel.send('You can\'t do this')
        return;
    }
    if (msg.mentions.members.size == 0 || !args[1] || isNaN(parseInt(args[1]))) {
        msg.channel.send('Usage: `>removexp (user) (amount)`')
        return;
    }
    var userData = await db.collection('users').doc(msg.mentions.members.first().id).get()
    var bal = (userData.exists && userData.data().bal) ? userData.data().bal : 0

    bal -= parseInt(args[1])
    db.collection('users').doc(msg.mentions.members.first().id).set({
        bal: bal
    }, { merge: true })
    msg.channel.send(`Removed **${args[1]}**xp from **${msg.mentions.users.first().username}**, their balance is now **${bal}**xp`)
    log(`${msg.author.username} removed ${args[1]}xp from ${msg.mentions.users.first()}`, msg.client, __filename)
}

async function setxp(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
        msg.channel.send('You can\'t do this')
        return;
    }
    if (msg.mentions.members.size == 0 || !args[1] || isNaN(parseInt(args[1]))) {
        msg.channel.send('Usage: `>setxp (user) (amount)`')
        return;
    }
    var userData = await db.collection('users').doc(msg.mentions.members.first().id).get()
    var bal = (userData.exists && userData.data().bal) ? userData.data().bal : 0

    bal = parseInt(args[1])
    db.collection('users').doc(msg.mentions.members.first().id).set({
        bal: bal
    }, { merge: true })
    msg.channel.send(`Set **${msg.mentions.users.first().username}**\'s xp to **${args[1]}**xp, their balance is now **${bal}**xp`)
    log(`${msg.author.username} set from ${msg.mentions.users.first()}'s xp to ${args[1]}`, msg.client, __filename)
}

async function resetxp(msg: Message, args: string[]) {
    if (!(msg.author.id == msg.guild.ownerID)) {
        msg.channel.send('You can\'t do this')
        return;
    }

    var data = (await db.collection('users').where('bal', '!=', null).get()).docs
    var delValue = firebase.firestore.FieldValue.delete()
    for (const doc of data) {
        doc.ref.set({
            bal: delValue,
            level: delValue,
            balLastRun: delValue,
            inv: delValue
        }, {merge: true})
    }
    msg.channel.send('Reset Economy')
    log(`${msg.author.username} reset the economy`, msg.client, __filename)
}



// Gamble Xp
async function togglegamble(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
        msg.channel.send('You can\'t do this')
        return;
    }
    var data = await db.collection('economy').doc('gamble').get()
    var currentState = data.exists && data.data().open ? data.data().open : false

    currentState = !currentState
    
    db.collection('economy').doc('gamble').set({
        open: currentState
    }, { merge: true })
    msg.channel.send(`${currentState ? 'Opened' : 'Closed'} The Casino`)
    log(`${msg.author.username} ${(currentState) ? 'Opened': 'Closed'} the casino.`, msg.client, __filename)
}

async function setjackpot(msg: Message, args: string[]) {
    if (!msg.member.hasPermission('MANAGE_GUILD')) {
        msg.channel.send('You can\'t do this')
        return;
    }
    if (isNaN(parseInt(args[0]))) {
        msg.channel.send('Usage: `>setjackpot (amount)`')
        return;
    }
    var data = await db.collection('economy').doc('gamble').get()
    var jackpot = (data.exists && data.data().jackpotAmount) ? data.data().jackpotAmount : 0

    jackpot = parseInt(args[0])
    db.collection('economy').doc('gamble').set({
        jackpotAmount: jackpot
    }, { merge: true })
    msg.channel.send(`Set the Jackpot Amount to to **${args[0]}**xp`)
    log(`${msg.author.username} set the jackpot amount to ${args[0]}`, msg.client, __filename)
}

export default {
    giveXp: givexp,
    removeXp: removexp,
    setXp: setxp,
    toggleGamble: togglegamble,
    setJackpot: setjackpot,
    resetXp: resetxp
}