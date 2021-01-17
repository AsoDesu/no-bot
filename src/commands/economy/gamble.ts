import { Message, MessageEmbed, MessageEmbedOptions } from "discord.js";
import format from './numberFormatter'
import randomcolor from '../../randomColor'

import firebase from 'firebase'
import 'firebase/firestore'
import '../../firebaseinnit'
var db = firebase.firestore()

// If i had a leaderboard for how bad my own code is, this entire file is a very close Number 2
// Number 1 of course being the leaderboard code
// I am so sorry Dumb Bot has to run this
// If you have a big brain and want to contribute to dumb bot, please fix this or the leaderboard code, thank you and have a nice day
// Also if you see this say hi to Aso :)

async function command(msg: Message, args: string[]) {
    var userfData = await db.collection('users').doc(msg.author.id).get()
    var bal = userfData.data().bal ? userfData.data().bal : 0

    var gambleData = await db.collection('economy').doc('gamble').get()
    if ((gambleData.exists && !gambleData.data().open) || !gambleData.exists) { msg.channel.send('The Casino is currently closed for maintainance, please try again later'); return; }
    var jackpotAmount = gambleData.exists && gambleData.data().jackpotAmount ? gambleData.data().jackpotAmount : 0

    var balWagered = parseInt(args[0])
    if (args[0] == 'info' || isNaN(balWagered)) { infoEmbed(msg, args, userfData, gambleData); return }

    if (bal < balWagered) { msg.channel.send('Do don\'t have enough xp to wager that much'); return; }

    bal -= balWagered

    var balGive = Math.floor(Math.random() * 2)
    switch (balGive) {
        case 0:
            msg.channel.send(new MessageEmbed({
                "title": "You Lost",
                "description": `-${balWagered} Points \n\nYour balance is now ${bal}`,
                "color": 15206665
            }))
            jackpotAmount += balWagered
            break;
        case 1:
            stage2()
            break;
        default:
            msg.channel.send('You find yourslef in an odd place, the gambling machine has come up inconclusive.... Aso\'s code broke, this message alone contains at least 50 spelling mistakes, so if you see this, ping Aso and tell him he sucks at spelling')
    }

    async function stage2() {
        var balGive2 = Math.floor(Math.random() * 100)

        if (balGive2 > 50) {
            bal += balWagered * 3
            msg.channel.send(new MessageEmbed({
                "title": "You Won",
                "description": `+${balWagered * 2} Points \n\nYour balance is now ${bal}`,
                "color": 1107977
            }))
        } else if (balGive2 > 1 && balGive2 < 50) {
            bal += balWagered * 2
            msg.channel.send(new MessageEmbed({
                "title": "You Won",
                "description": `+${balWagered} Points \n\nYour balance is now ${bal}`,
                "color": 1107977
            }))
        } else if (balGive2 == 1) {
            bal += jackpotAmount
            msg.channel.send(new MessageEmbed({
                "title": "JACKPOT!!",
                "description": `+${jackpotAmount} Points \n\nYour balance is now ${bal}`,
                "color": 1107977
            }))
        } else {
            bal += balWagered * 2
            msg.channel.send(new MessageEmbed({
                "title": "You Won",
                "description": `+${balWagered} Points \n\nYour balance is now ${bal}`,
                "color": 1107977
            }))
        }

    }

    db.collection('users').doc(msg.author.id).set({
        bal: bal
    }, { merge: true })

    db.collection('economy').doc('gamble').set({
        jackpotAmount: jackpotAmount
    }, { merge: true })
}

async function infoEmbed(msg: Message, args: string[], userfData: firebase.firestore.DocumentSnapshot, gambleData: firebase.firestore.DocumentSnapshot) {
    var bal = userfData.data().bal ? userfData.data().bal : 0
    var jackpotAmount = gambleData.exists && gambleData.data().jackpotAmount ? gambleData.data().jackpotAmount : 0
    var gambleInfoEmbed: MessageEmbedOptions = {
        "title": "Dumb Bot Casino",
        "description": `Current Jackpot Amount: **${format.numberWithCommas(jackpotAmount)}**xp\nYour Balance: **${format.numberWithCommas(bal)}**xp`,
        "color": randomcolor()
    }
    // I'm addicted to ternary operators
    msg.channel.send((args[0] == 'info') ? '' : 'You need to provide an amount to wager `>gamble (amount)`', new MessageEmbed(gambleInfoEmbed))
}

export default command