import { Message } from "discord.js";
import shop from './shop'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import '../../../firebaseinnit'
var db = firebase.firestore()

type inventory = { name: string, amount: number }

async function command(msg: Message, args: string[]) {
    var items = shop.items
    var itemName = msg.content.replace('=use ', '')
    var item = items.find(i => i.name.toLowerCase() == itemName.toLowerCase())
    if (!item) { msg.channel.send('That item doesn\'t exist'); return; }

    var userData = await db.collection('users').doc(msg.author.id).get()
    var bal = userData.exists && userData.data().bal ? userData.data().bal : 0
    var inv: inventory[] = userData.exists && userData.data().inv ? userData.data().inv : []
    var invItem = inv.find(i => i.name.toLowerCase() == itemName.toLowerCase())

    if (inv == [] || !invItem || invItem.amount == 0) {
        msg.channel.send('You don\'t have that item')
        return;
    }
    invItem.amount -= 1
    if (invItem.amount == 0) { inv.splice(inv.findIndex(i => i.name.toLowerCase() == itemName.toLowerCase())) }
    else { inv[inv.findIndex(i => i.name.toLowerCase() == itemName.toLowerCase())] == invItem }

    var xpGave = Math.floor(Math.random() * item.maxXp)
    bal += xpGave

    db.collection('users').doc(msg.author.id).set({
        bal: bal,
        inv: inv
    })
    msg.channel.send(`You opened a ${item.name} and found ${xpGave}xp, Your balance is now ${bal}xp`)
}

export default command