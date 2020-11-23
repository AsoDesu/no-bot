import { Message } from "discord.js";

var responses = [
    "no",
    "NO",
    "nope",
    "NOPE",
    "<:MonkaS:777596840476147783>",
    "<a:pepeangry:777536582928171012>",
    "<a:shakechamp:777952031989694474>"
]

function YEP(msg: Message) {
    msg.channel.send(responses[Math.floor(Math.random() * responses.length)])
} 

export default YEP