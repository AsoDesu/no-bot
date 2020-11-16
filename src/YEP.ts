import { Message } from "discord.js";

var responses = [
    "no",
    "NO",
    "nope",
    "NOPE",
    "<:MonkaS:777596840476147783>",
    "<:pepeangry:777536582928171012>",
    "<:shakechamp:777952031989694474>"
]

function YEP(msg: Message) {
    msg.channel.send(responses[Math.floor(Math.random() * responses.length)])
} 

export default YEP