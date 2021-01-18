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
    var itemName = msg.content.replace('>buy ', '')
    var item = items.find(i => i.name.toLowerCase() == itemName.toLowerCase())
    if (!item) { msg.channel.send('That item doesn\'t exist'); return; }

    var userData = await db.collection('users').doc(msg.author.id).get()
    var bal = userData.exists && userData.data().bal ? userData.data().bal : 0
    var inv: inventory[] = userData.exists && userData.data().inv ? userData.data().inv : []

    if (bal < item.cost) { msg.channel.send('You don\'t have enough balance to do that'); return; }

    bal -= item.cost
    var invItem = inv.find(i => i.name == item.name)
    if (invItem) {
        inv[inv.findIndex(i => i.name == item.name)].amount = invItem.amount += 1
    } else {
        inv.push({
            "name": item.name,
            "amount": 1
        })
    }

    db.collection('users').doc(msg.author.id).set({
        bal: bal,
        inv: inv
    }, { merge: true })
    msg.channel.send(`Bought ${item.name} for **${item.cost}**xp, Your balance is now **${bal}**xp`)
}

export default command