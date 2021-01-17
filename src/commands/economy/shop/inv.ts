import { Message, EmbedFieldData, MessageEmbed } from "discord.js";
import colour from '../../../randomColor'

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import '../../../firebaseinnit'
var db = firebase.firestore()

type inventory = { name: string, amount: number }

async function command(msg: Message, args: string[]) {
    var userData = await db.collection('users').doc(msg.author.id).get()
    var inv: inventory[] = userData.exists && userData.data().inv ? userData.data().inv : []

    if (inv.length == 0 || inv == []) {
        msg.channel.send('You don\'t have anything in your inventory, do >shop to see what you can buy')
        return;
    }

    msg.channel.send(new MessageEmbed({
        "title": `${msg.author.username}'s Inventory`,
        "color": colour(),
        "description": "Do >use to use your items",
        "fields": generateFields(inv)
    }))
}

function generateFields(inv: inventory[]) {
        var tempArr: EmbedFieldData[] = []
        for (const item of inv) {
            tempArr.push({
                "name": item.name,
                "value": `Amount: ${item.amount}`
            })
        }
        return tempArr
}

export default command