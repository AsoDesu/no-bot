import { Message } from "discord.js"

var lastCmd = 0

type rateLimit = {
    rateLimit: boolean,
    againIn: number
}

function isRateLimit(msg: Message, time: number): rateLimit {
    var date = new Date()
    if (msg.createdTimestamp - lastCmd < time) {
        var tryAgainIn = (msg.createdTimestamp - lastCmd - time) * -1
        return { rateLimit: true, againIn: tryAgainIn}
    } else {
        lastCmd = date.getTime()
        return { rateLimit: false, againIn: 0 }
    }
}

export default isRateLimit