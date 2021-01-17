import { Message, MessageEmbed, EmbedFieldData } from "discord.js";
import colour from '../../../randomColor'
import buy from './buy'
import inv from './inv'
import use from './use'

type item = { name: string, cost: number, maxXp: number }

var items: item[] = [
    { name: "Common Chest", cost: 50, maxXp: 100 },
    { name: "Uncommon Chest", cost: 100, maxXp: 200 },
    { name: "Rare Chest", cost: 200, maxXp: 400 },
    { name: "Legendary Chest", cost: 500, maxXp: 1000 }
]

function command(msg: Message, args: string[]) {
    msg.channel.send(new MessageEmbed({
        "title": "NO Clan Shop",
        "color": colour(),
        "description": "Do >buy (item) to buy an item",
        "fields": generateFields()
    }))
}

function generateFields() {
    var tempArr: EmbedFieldData[] = []
    for (const item of items) {
        tempArr.push({
            "name": item.name,
            "value": `Price: ${item.cost}xp, Max XP: ${item.maxXp}`
        })
    }
    return tempArr
}

export default {
    shopcmd: command,
    buycmd: buy,
    invcmd: inv,
    usecmd: use,
    items: items
}