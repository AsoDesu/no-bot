import { Message } from "discord.js";

var responses = [
    "wat?",
    "you rang?",
    "YEP.... wait",
    "why did you have to ping me",
    "please don't abuse pings",
    "<:pingree:777529870397210665>",
    "i was vibing",
    "no",
    "i'm sleeping",
    "```01011001 01101111 01110101 00100000 01110100 01101111 01101111 01101011 00100000 01110100 01101000 01100101 00100000 01110100 01101001 01101101 01100101 00100000 01110100 01101111 00100000 01110100 01110010 01100001 01101110 01110011 01101100 01100001 01110100 01100101 00100000 01110100 01101000 01101001 01110011 00100000 01001011 01000101 01001011 01010111```"
]

function BOT(msg: Message) {
    msg.channel.send(responses[Math.floor(Math.random() * responses.length)])
}

export default BOT