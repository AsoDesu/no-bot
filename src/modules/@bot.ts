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

var responses2 = [
    "okay, calling the police",
    "oof",
    "f",
    "that sucks",
    "i'm on my way",
    "aaaaaaaaaaaaaaaaaaaaaaa",
    "```01101111 01101000 00100000 01101101 01111001 00100000 01100111 01101111 01100100 00101100 00100000 01100001 01110010 01100101 00100000 01111001 01101111 01110101 00100000 01101111 01101011 01100001 01111001 00111111```",
    "oh my god, are you okay?",
    "I cound't find any enabled video skills, take a look at the help section in your Alexa app"
]

function BOT(msg: Message) {
    if (msg.content.includes('cute')) {
        msg.channel.send('<:peepoblush:780156050536005634>')
        return;
    }
    if (msg.content.includes('hostage')) {
        msg.channel.send(responses2[Math.floor(Math.random() * responses2.length)])
        return
    }
    msg.channel.send(responses[Math.floor(Math.random() * responses.length)])
}

export default BOT